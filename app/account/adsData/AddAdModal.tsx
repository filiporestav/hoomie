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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("ads")
        .insert({
          user_id: user.id,
          property_description: propertyDescription,
          area_description: areaDescription,
          location,
          country,
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
              disabled={loading}
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
            >
              {loading ? "Adding..." : "Add Ad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
