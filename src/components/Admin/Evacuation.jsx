import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import supabase from "../supabaseClient";

const Evacuation = () => {
  const [activeView, setActiveView] = useState("cards");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState("");
  const [evacuationCenters, setEvacuationCenters] = useState([]);

  const fetch_data = async () => {
    try {
      const { error, data } = await supabase.from("EvacuationCenter").select("*");
      if (error) throw error;
      setEvacuationCenters(data);
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error("Error during fetching data:", error.message);
    }
  };

  const handleCardClick = (center) => {
    setSelectedCenter(center);
    setName(center.name || "");
    setLocation(center.location || "");
    setCapacity(center.capacity || "");
    setImage(center.image || "");
    setStatus(center.status || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCenter(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this evacuation center?");
    if (confirmDelete) {
      try {
        const { error } = await supabase.from("EvacuationCenter").delete().eq("id", id);
        if (error) throw error;
        alert("Evacuation center deleted successfully!");
        fetch_data();
        closeModal();
      } catch (error) {
        console.error("Error deleting evacuation center:", error);
        alert("Error deleting evacuation center.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from("EvacuationCenter")
        .update({ name, location, capacity, status })
        .eq("id", selectedCenter.id);
      if (error) throw error;
      alert("Evacuation center updated successfully!");
      fetch_data();
      closeModal();
    } catch (error) {
      console.error("Error updating evacuation center:", error);
      alert("Error updating evacuation center.");
    }
  };

  const handlePhotoUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      try {
        const filePath = `${selectedFile.name}`;
        const { data, error } = await supabase.storage
          .from("Images")
          .upload(filePath, selectedFile);
        if (error) throw error;
        const { data: publicURL, error: urlError } = supabase.storage
          .from("Images")
          .getPublicUrl(filePath);
        if (urlError) throw urlError;
        setImage(publicURL.publicUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image: " + error.message);
      }
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-mono xl:flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold text-gray-800">
                  | List of Evacuation Centers
                </h1>
                <button
                  className="bg-bttn text-white px-4 py-2 rounded-md hover:bg-bttn"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Evacuation Center
                </button>
              </div>
              <hr />
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {evacuationCenters.map((center) => (
                  <div
                    key={center.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleCardClick(center)}
                  >
                    <img
                      src={center.image}
                      alt={center.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{center.name}</h3>
                      <div className="text-gray-600 mb-2">{center.location}</div>
                      <div
                        className={`${
                          center.status === "Closed"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {center.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Update Modal */}
      {isModalOpen && selectedCenter && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold">Update Evacuation Center</h2>
            <div className="mt-4">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />
              <label>Capacity</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => handleDelete(selectedCenter.id)}
              >
                Delete
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evacuation;
