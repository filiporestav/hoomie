"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "../../utils/supabase/client";
import { geocodeAddress } from "../../utils/geocode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { CarouselWithControls } from "@/components/ui/carousel-with-controls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DateRange } from "react-day-picker";
import { ImagePlus, Camera } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface RequiredDatePickerWithRangeProps {
  value: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  error?: string;
}

function RequiredDatePickerWithRange({ value, onChange, error }: RequiredDatePickerWithRangeProps) {
  return (
    <div>
      <DatePickerWithRange value={value} onChange={onChange} />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface AddEditAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onAdAdded?: () => void;
  onAdUpdated?: () => void;
  onAdDeleted?: () => void;
  action: "add" | "edit";
  ad?: any;
}

export default function AddEditAdModal({
  isOpen,
  onClose,
  user,
  onAdAdded,
  onAdUpdated,
  onAdDeleted,
  action,
  ad,
}: AddEditAdModalProps) {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [areaDescription, setAreaDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (action === "edit" && ad) {
      setTitle(ad.title || "");
      setPropertyDescription(ad.property_description || "");
      setAreaDescription(ad.area_description || "");
      setAddress(ad.address || "");
      setCity(ad.city || "");
      setCountry(ad.country || "");
      setExistingImages(ad.image_urls || []);
      setDateRange({
        from: ad.availability_start
          ? new Date(ad.availability_start)
          : undefined,
        to: ad.availability_end ? new Date(ad.availability_end) : undefined,
      });
    }
  }, [action, ad]);

  const normalizeFileName = (fileName: string) => {
    const specialChars: { [key: string]: string } = {
      å: "a", ä: "a", ö: "o", Å: "A", Ä: "A", Ö: "O",
    };
    const regex = new RegExp(Object.keys(specialChars).join("|"), "g");
    let normalizedFileName = fileName.replace(regex, (match) => specialChars[match]);
    normalizedFileName = normalizedFileName.replace(/[^a-zA-Z0-9 ]/g, "");
    normalizedFileName = normalizedFileName.replace(/ /g, "_");
    return normalizedFileName;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(e.target.files)]);
    }
  };

  const handleImageRemove = async (index: number) => {
    try {
      if (index < existingImages.length) {
        const imageUrl = existingImages[index];
        const pathToDelete = imageUrl.split(`${supabase.storage.from('ad-images').getPublicUrl('').data.publicUrl}`)[1];
        const { error: removeError } = await supabase.storage
          .from("ad-images")
          .remove([pathToDelete]);
        if (removeError) throw removeError;
        setExistingImages(existingImages.filter((_, i) => i !== index));
      } else {
        setSelectedImages(selectedImages.filter((_, i) => i !== index - existingImages.length));
      }
    } catch (error) {
      console.error("Failed to remove image:", error);
      alert("Failed to remove image. Please try again.");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Annonstitel är obligatorisk";
    if (!propertyDescription.trim()) newErrors.propertyDescription = "Beskrivning av fastigheten är obligatorisk";
    if (!areaDescription.trim()) newErrors.areaDescription = "Beskrivning av läget är obligatorisk";
    if (!address.trim()) newErrors.address = "Adress är obligatorisk";
    if (!city.trim()) newErrors.city = "Stad är obligatorisk";
    if (!country.trim()) newErrors.country = "Land är obligatoriskt";
    if (!dateRange?.from || !dateRange?.to) {
      newErrors.dateRange = "Datumintervall är obligatoriskt";
    }
    if (existingImages.length === 0 && selectedImages.length === 0) newErrors.images = "Minst en bild är obligatorisk";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { latitude, longitude } = await geocodeAddress(address, city, country);
      const imageUrls = [...existingImages];

      for (const image of selectedImages) {
        const uniqueSuffix = uuidv4();
        const normalizedUrl = normalizeFileName(image.name) + `-${uniqueSuffix}`;
        const { data, error } = await supabase.storage
          .from("ad-images")
          .upload(`${user.id}/${normalizedUrl}`, image);

        if (error) throw error;
        const publicUrl = supabase.storage
          .from("ad-images")
          .getPublicUrl(`${user.id}/${normalizedUrl}`);

        imageUrls.push(publicUrl.data.publicUrl);
      }

      const adData = {
        user_id: user.id,
        title,
        property_description: propertyDescription,
        area_description: areaDescription,
        address,
        city,
        country,
        image_urls: imageUrls,
        latitude,
        longitude,
        availability_start: dateRange?.from,
        availability_end: dateRange?.to,
      };

      if (action === "add") {
        const { error } = await supabase.from("ads").insert(adData);
        if (error) throw error;
        onAdAdded?.();
      } else {
        const { error } = await supabase.from("ads").update(adData).eq("id", ad.id);
        if (error) throw error;
        onAdUpdated?.();
      }

      onClose();
    } catch (error) {
      alert(`Failed to ${action} ad. Please try again.`);
      console.error(`Error ${action}ing ad:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const publicUrlPrefix = supabase.storage.from('ad-images').getPublicUrl('').data.publicUrl;
      const pathsToDelete = existingImages.map((url) => url.split(publicUrlPrefix)[1]);

      if (pathsToDelete.length > 0) {
        const { error: removeError } = await supabase.storage
          .from("ad-images")
          .remove(pathsToDelete);

        if (removeError) throw removeError;
      }

      const { error } = await supabase.from("ads").delete().eq("id", ad.id);
      if (error) throw error;

      onAdDeleted?.();
      onClose();
    } catch (error) {
      alert("Failed to delete ad. Please try again.");
      console.error("Error deleting ad:", error);
    }
  };

  const handleImagePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  const isFormValid = title && propertyDescription && areaDescription && address && city && country && dateRange?.from && dateRange?.to && (existingImages.length > 0 || selectedImages.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {action === "add" ? "Lägg upp en ny annons" : "Ändra annons"}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-4 md:w-1/2">
              <div className="space-y-2">
                <Label htmlFor="title">Annonstitel</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Lägg till titel"
                  required
                  aria-invalid={errors.title ? 'true' : 'false'}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {errors.title && <p id="title-error" className="text-sm text-red-500">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyDescription">Beskrivning av fastigheten</Label>
                <Textarea
                  id="propertyDescription"
                  value={propertyDescription}
                  onChange={(e) => setPropertyDescription(e.target.value)}
                  placeholder="Beskriv fastigheten"
                  required
                  aria-invalid={errors.propertyDescription ? 'true' : 'false'}
                  aria-describedby={errors.propertyDescription ? 'propertyDescription-error' : undefined}
                />
                {errors.propertyDescription && <p id="propertyDescription-error" className="text-sm text-red-500">{errors.propertyDescription}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="areaDescription">Beskrivning av läget</Label>
                <Textarea
                  id="areaDescription"
                  value={areaDescription}
                  onChange={(e) => setAreaDescription(e.target.value)}
                  placeholder="Beskriv området"
                  required
                  aria-invalid={errors.areaDescription ? 'true' : 'false'}
                  aria-describedby={errors.areaDescription ? 'areaDescription-error' : undefined}
                />
                {errors.areaDescription && <p id="areaDescription-error" className="text-sm text-red-500">{errors.areaDescription}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adress</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ange adress"
                  required
                  aria-invalid={errors.address ? 'true' : 'false'}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                />
                {errors.address && <p id="address-error" className="text-sm text-red-500">{errors.address}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Stad</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ange stad"
                  required
                  aria-invalid={errors.city ? 'true' : 'false'}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
                {errors.city && <p id="city-error" className="text-sm text-red-500">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Land</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Ange land"
                  required
                  aria-invalid={errors.country ? 'true' : 'false'}
                  aria-describedby={errors.country ? 'country-error' : undefined}
                />
                {errors.country && <p id="country-error" className="text-sm text-red-500">{errors.country}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateRange">Tillgänglig för byte mellan</Label>
                <RequiredDatePickerWithRange
                  value={dateRange}
                  onChange={(newDateRange) => setDateRange(newDateRange)}
                  error={errors.dateRange}
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="space-y-2">
                <Label>Bilder</Label>
                {existingImages.length > 0 || selectedImages.length > 0 ? (
                  <>
                    <CarouselWithControls
                      images={[
                        ...existingImages,
                        ...selectedImages.map((file) =>
                          URL.createObjectURL(file)
                        ),
                      ]}
                      onRemove={handleImageRemove}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleImagePlaceholderClick}
                      className="mt-4 w-full"
                    >
                      <Camera className="mr-2  h-4 w-4" />
                      Lägg till Bilder
                    </Button>
                  </>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer"
                    onClick={handleImagePlaceholderClick}
                  >
                    <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Lägg till bilder
                    </span>
                  </div>
                )}
                <Input
                  id="images"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                  required={existingImages.length === 0 && selectedImages.length === 0}
                  aria-invalid={errors.images ? 'true' : 'false'}
                  aria-describedby={errors.images ? 'images-error' : undefined}
                />
                {errors.images && <p id="images-error" className="text-sm text-red-500">{errors.images}</p>}
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          {action === "edit" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Ta bort annons</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Denna åtgärd kan inte ångras. Detta kommer att raderas
                    permanent din annons.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Ångra</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Ta bort annons
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button type="button" variant="outline" onClick={onClose}>
            Ångra
          </Button>
          <Button type="submit" disabled={loading || !isFormValid} onClick={handleSubmit}>
            {loading
              ? "Bearbetar..."
              : action === "add"
              ? "Lägg till annons"
              : "Spara ändringar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}