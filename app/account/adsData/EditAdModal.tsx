"use client";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

export default function EditAdModal({ isOpen, onClose, user, ad }: { isOpen: boolean; onClose: () => void; user: any; ad: any }) {
    const supabase = createClient();

    const [propertyDescription, setPropertyDescription] = useState(ad.property_description);
    const [areaDescription, setAreaDescription] = useState(ad.area_description);
    const [location, setLocation] = useState(ad.location);
    const [country, setCountry] = useState(ad.country);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Reset state when ad changes
        if (ad) {
            setPropertyDescription(ad.property_description);
            setAreaDescription(ad.area_description);
            setLocation(ad.location);
            setCountry(ad.country);
        }
    }, [ad]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("ads")
                .update({
                    property_description: propertyDescription,
                    area_description: areaDescription,
                    location,
                    country
                })
                .eq("id", ad.id);

            if (error) {
                console.error("Error updating ad:", error.message);
                throw error;
            }

            alert("Ad successfully updated!");
            onClose();
        } catch (error) {
            console.error("Error updating ad:", error);
            alert("Failed to update ad. Please try again.");
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

            if (error) {
                console.error("Error deleting ad:", error.message);
                throw error;
            }

            alert("Ad successfully deleted!");
            onClose();
        } catch (error) {
            console.error("Error deleting ad:", error);
            alert("Failed to delete ad. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
                <h2 className="text-2xl font-bold mb-4">Edit Ad</h2>

                <form onSubmit={handleUpdate}>
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
