"use client";
import { useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function AddAdModal({
  isOpen,
  onClose,
  user,
  onAdAdded
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onAdAdded: () => void;
}) {
  const supabase = createClient();

  const [propertyDescription, setPropertyDescription] = useState("");
  const [areaDescription, setAreaDescription] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Modify the image upload handler to append new files
  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImageFiles((prevFiles) => [...prevFiles, ...filesArray]); // Append new files
    }
  };

  // Function to upload all images
  const uploadImages = async () => {
    const uploadedImagePaths: string[] = [];

    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}-${Date.now()}-${Math.random()}.${fileExt}`;

        const { error } = await supabase.storage
          .from("ad-images")
          .upload(filePath, file);

        if (error) {
          throw error;
        }

        const publicUrl = supabase.storage
          .from("ad-images")
          .getPublicUrl(filePath).data.publicUrl;

        uploadedImagePaths.push(publicUrl);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
      throw error;
    }

    return uploadedImagePaths;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        setUploadingImages(true);
        imageUrls = await uploadImages();
        setUploadingImages(false);
      }

      const { error } = await supabase
        .from("ads")
        .insert({
          user_id: user.id,
          property_description: propertyDescription,
          area_description: areaDescription,
          location,
          country,
          image_urls: imageUrls, // Add image URLs here
        });

      if (error) {
        console.error("Supabase Insert Error:", error.message);
        throw error;
      }

      alert("Ad successfully added!");
      onAdAdded(); // Notify the parent component to refresh the ads
      onClose();
    } catch (error) {
      console.error("Error adding ad:", error);
      alert("Failed to add ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-4">Add New Ad</h2>

        <form onSubmit={handleSubmit}>
          {/* Property and Area Descriptions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="propertyDescription">
              Property Description
            </label>
            <textarea
              id="propertyDescription"
              value={propertyDescription}
              onChange={(e) => setPropertyDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="areaDescription">
              Area Description
            </label>
            <textarea
              id="areaDescription"
              value={areaDescription}
              onChange={(e) => setAreaDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>

          {/* Location/City and Country */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="location">
              Location/City
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="country">
              Country
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
            />
            {/* Display thumbnails of selected images */}
            <div className="mt-2 grid grid-cols-4 gap-2">
              {imageFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Selected file ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
            >
              {loading || uploadingImages ? "Adding..." : "Add Ad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
