import React, { useState, useEffect, useCallback } from 'react';
import { updateProfile } from '../api/users'; // ✅ fixed import
import { X, Save, Edit } from 'lucide-react';

interface EditProfileModalProps {
    initialDescription?: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newDescription: string | null) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
    initialDescription, 
    isOpen, 
    onClose, 
    onSave 
}) => {
    const [description, setDescription] = useState(initialDescription || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync when props change
    useEffect(() => {
        setDescription(initialDescription || '');
        setError(null);
    }, [initialDescription, isOpen]);

    const handleSave = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const newDescriptionValue = description.trim() === '' ? null : description.trim();

            // ✅ Call updateProfile with the correct structure
            await updateProfile({ description: newDescriptionValue });
            
            onSave(newDescriptionValue);
            onClose();

        } catch (err: any) {
            console.error('Failed to update profile description:', err);
            setError(err.response?.data?.message || 'Failed to save description. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [description, onSave, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform scale-100 transition-transform duration-300">
                
                {/* Header */}
                <div className="p-5 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Edit className="w-5 h-5 mr-2 text-blue-500" />
                        Edit Professional Summary
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                        Your professional description, skills, and achievements:
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={8}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 transition duration-150 ease-in-out shadow-sm"
                        placeholder="e.g., Senior Software Engineer with 8 years of experience in React and Node.js..."
                        disabled={loading}
                    ></textarea>

                    {error && (
                        <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                            Error: {error}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition duration-150 ease-in-out shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-md disabled:bg-blue-400 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
