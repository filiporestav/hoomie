"use client";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

export default function EditAdModal({
  isOpen,
  onClose,
  user,
  ad,
  onAdUpdated,
  onAdDeleted
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  ad: any;
  onAdUpdated: () => void;
  onAdDeleted: () => void;
}) {
  const supabase = createClient();
  const [propertyDescription, setPropertyDescription] = useState(ad.property_description);
  const [areaDescription, setAreaDescription] = useState(ad.area_description);
  const [location, setLocation] = useState(ad.location);
  const [country, setCountry] = useState(ad.country);
  const [existingImages, setExistingImages] = useState<string[]>(ad.image_urls || []);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const normalizeFileName = (fileName: string) => {
    const specialChars: { [key: string]: string } = {
      'å': 'a', 'ä': 'a', 'ö': 'o',
      'Å': 'A', 'Ä': 'A', 'Ö': 'O',
      // Add other special characters as needed
    };

    const regex = new RegExp(Object.keys(specialChars).join('|'), 'g');

    return fileName.replace(regex, match => specialChars[match]);
  };

  useEffect(() => {
    if (ad) {
      setPropertyDescription(ad.property_description);
      setAreaDescription(ad.area_description);
      setLocation(ad.location);
      setCountry(ad.country);
      setExistingImages(ad.image_urls || []);
    }
  }, [ad]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(e.target.files)]);
    }
  };

  const handleImageRemove = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      setSelectedImages(selectedImages.filter((_, i) => i !== index));
    }
  };

  const slideToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (existingImages.length + selectedImages.length));
  };

  const slideToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? existingImages.length + selectedImages.length - 1 : prevIndex - 1
    );
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = [...existingImages];
      for (const image of selectedImages) {
        const normalizedUrl = normalizeFileName(image.name)
        const { data, error } = await supabase.storage
          .from("ad-images")
          .upload(`${user.id}/${normalizedUrl}`, image);

        if (error) throw error;
        const publicUrl = supabase.storage
          .from("ad-images")
          .getPublicUrl(`${user.id}/${normalizedUrl}`);
        imageUrls.push(publicUrl.data.publicUrl);
      }

      const { error } = await supabase
        .from("ads")
        .update({
          property_description: propertyDescription,
          area_description: areaDescription,
          location,
          country,
          image_urls: imageUrls,
        })
        .eq("id", ad.id);

      if (error) throw error;

      alert("Ad successfully updated!");
      onAdUpdated();
      onClose();
    } catch (error) {
      alert("Failed to update ad. Please try again.");
      console.error("Error updating ad:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", ad.id);

      if (error) throw error;

      alert("Ad successfully deleted!");
      onAdDeleted();
      onClose();
    } catch (error) {
      alert("Failed to delete ad. Please try again.");
      console.error("Error deleting ad:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const allImages = [...existingImages, ...selectedImages.map((file) => URL.createObjectURL(file))];
  const currentImage = allImages[currentImageIndex];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Ad</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Property and Area description inputs */}
          <div>
            <label className="block text-sm font-medium">Property Description</label>
            <textarea
              value={propertyDescription}
              onChange={(e) => setPropertyDescription(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Area Description</label>
            <textarea
              value={areaDescription}
              onChange={(e) => setAreaDescription(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Location and Country fields */}
          <div>
            <label className="block text-sm font-medium">Location/City</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium">Images</label>
            <input type="file" multiple onChange={handleImageChange} />
          </div>

          {/* Image Preview with Slide and Remove Option */}
          {allImages.length > 0 && (
            <div className="relative mt-4">
              <div className="flex justify-center">
                <img
                  src={currentImage}
                  alt="Preview"
                  className="h-auto max-h-96 w-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={slideToPrevImage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2"
              >
                &#8249;
              </button>
              <button
                type="button"
                onClick={slideToNextImage}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2"
              >
                &#8250;
              </button>

              {/* Improved Red Square Button to Remove Images */}
              <button
                type="button"
                onClick={() => handleImageRemove(currentImageIndex, currentImageIndex < existingImages.length)}
                className="absolute top-2 right-2 bg-red-600 text-white text-sm p-1 rounded-md"
              >
                X
              </button>
            </div>
          )}

          {/* Submit and Delete buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Update Ad"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete Ad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
