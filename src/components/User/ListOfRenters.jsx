import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import { IoArrowBackCircle } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { IoMdPersonAdd } from "react-icons/io";
import { LuSend } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

const ListOfRenters = () => {
  // State to manage the renters list with form data
  const [renters, setRenters] = useState([
    { id: 1, fullname: "", sex: "", rentalType: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to add a new renter form
  const addRenter = () => {
    setRenters((prevRenters) => [
      ...prevRenters,
      { id: prevRenters.length + 1, fullname: "", sex: "", rentalType: "" },
    ]);
  };

  // Function to delete a renter form
  const deleteRenter = (id) => {
    setRenters((prevRenters) =>
      prevRenters.filter((renter) => renter.id !== id)
    );
  };

  // Function to handle input changes dynamically
  const handleInputChange = (id, field, value) => {
    setRenters((prevRenters) =>
      prevRenters.map((renter) =>
        renter.id === id ? { ...renter, [field]: value } : renter
      )
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true); // Start loading animation
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Replace with actual API call
      console.log("Submitted Renters Data:", renters);
      // You can handle success or reset the form here
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsLoading(false); // End loading animation
    }
  };

  return (
    <div className="h-screen bg-gray-100 font-mono lg:flex">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 overflow-auto">
          <div className="w-full mx-auto bg-white rounded shadow-lg p-10 border border-blue-100">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-semibold italic flex gap-5 mt-1">
                <NavLink to="/forms">
                  <button className="mt-1">
                    <IoArrowBackCircle />
                  </button>
                </NavLink>
                List of Renters
              </h2>
              <button
                className="btn bg-bttn font-bold text-white"
                onClick={addRenter}
              >
                <IoMdPersonAdd />
                Add Renter
              </button>
            </div>
            <hr />

            {/* Render each renter form dynamically */}
            {renters.map((renter, index) => (
              <div key={renter.id} className="mb-6 mt-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-bold text-gray-700 italic">
                    Renter #{index + 1}
                  </h3>
                  <button
                    className="text-red-500 font-bold hover:text-red-700"
                    onClick={() => deleteRenter(renter.id)}
                    aria-label="Delete Renter"
                  >
                    <IoMdClose size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
                  <div>
                    <label
                      htmlFor={`renter-fullname-${renter.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id={`renter-fullname-${renter.id}`}
                      value={renter.fullname}
                      onChange={(e) =>
                        handleInputChange(renter.id, "fullname", e.target.value)
                      }
                      className="input input-bordered w-full"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`renter-sex-${renter.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sex
                    </label>
                    <select
                      id={`renter-sex-${renter.id}`}
                      value={renter.sex}
                      onChange={(e) =>
                        handleInputChange(renter.id, "sex", e.target.value)
                      }
                      className="select select-bordered w-full max-w-xs"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={`renter-type-${renter.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Type of Rental
                    </label>
                    <select
                      id={`renter-type-${renter.id}`}
                      value={renter.rentalType}
                      onChange={(e) =>
                        handleInputChange(
                          renter.id,
                          "rentalType",
                          e.target.value
                        )
                      }
                      className="select select-bordered w-full max-w-xs"
                    >
                      <option>House</option>
                      <option>Pad</option>
                      <option>Room</option>
                    </select>
                  </div>
                </div>
                <hr />
              </div>
            ))}

            <div className="flex justify-end mt-10 gap-3">
              <button
                className={`w-1/4 text-white btn font-bold ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-success hover:bg-success"
                }`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LuSend />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListOfRenters;