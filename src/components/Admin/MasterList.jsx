import AdminSidebar from "./AdminSidebar";
import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";

const MasterList = () => {
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    surname: "",
    firstname: "",
    middlename: "",
    age: "",
    occupation: "",
    income: "",
    dob: "",
    sex: "",
  });
  const [viewingFamilyMember, setViewingFamilyMember] = useState(null); 
  const [familyMemberData, setFamilyMemberData] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [fullname, setFullName] = useState('');
  const [relation, setRelation] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [education, setEducation] = useState('');
  const [occupation, setOccupation] = useState('');


  // Fetch data from the DAF table
  const fetch_data = async () => {
    try {
      const { error, data } = await supabase.from("DAF").select("*");
      if (error) throw error;
      setData(data); // Set the data to state
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error("Error during fetching history:", error.message);
    }
  };

  useEffect(() => {
    fetch_data(); // Fetch data on component mount
  }, []);

  // Fetch family members based on the selected DAF row
  const fetchFamilyMembers = async (id) => {
    try {
      const { error, data } = await supabase
        .from("FamilyMembers")
        .select("*")
        .eq("head_id", id); // Assuming "daf_id" is the foreign key in the FamilyMembers table
      if (error) throw error;
      setFamilyMemberData(data); // Set the family member data to state
      setViewingFamilyMember(true); // Open the modal
    } catch (error) {
      console.error("Error fetching family members:", error.message);
      alert("An error occurred while fetching the family members.");
    }
  };

  // Handle deleting a record
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("DAF").delete().eq("id", id);
      if (error) throw error;
      setData(data.filter((item) => item.id !== id)); // Remove the deleted item from the state
      alert("Record deleted successfully.");
    } catch (error) {
      console.error("Error deleting record:", error.message);
      alert("An error occurred while deleting the record.");
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      const { error } = await supabase.from("FamilyMembers").delete().eq("id", id);
      if (error) throw error;
     window.location.reload();
    } catch (error) {
      console.error("Error deleting record:", error.message);
      alert("An error occurred while deleting the record.");
    }
  };

  // Handle editing a record
  const handleEdit = (item) => {
    setEditingItem(item); // Set the item to be edited
    setFormData({
      surname: item.surname,
      firstname: item.firstname,
      middlename: item.middlename,
      age: item.age,
      occupation: item.occupation,
      income: item.income,
      dob: item.dob,
      sex: item.sex,
    });
  };

  const familyedit = (item) => {
  setSelectedMember(item);
  setFullName(item.fullname || "");
  setRelation(item.relation || "");
  setDob(item.dob || "");
  setAge(item.age || "");
  setSex(item.sex || "");
  setEducation(item.education || "");
  setOccupation(item.occupation || "");
  setShowEditModal(true);

  };


  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("DAF")
        .update(formData)
        .eq("id", editingItem.id);
      if (error) throw error;
      setData(
        data.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      ); // Update the state
      setEditingItem(null); // Close the editing form
      alert("Record updated successfully.");
    } catch (error) {
      console.error("Error updating record:", error.message);
      alert("An error occurred while updating the record.");
    }
  };

  const handleUpdateMember = async () => {
    try {
      const { error } = await supabase
        .from("FamilyMembers")
        .update({ fullname, relation, dob, sex, age, education, occupation })
        .eq("id", selectedMember.id);
      if (error) throw error;
    window.location.reload();
    } catch (error) {
      console.error("Error updating evacuation center:", error);
      alert("Error updating Data .");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 font-mono xl:flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="bg-gray-100 min-h-screen p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center mb-6 mt-5 p-4">
                  <h1 className="text-xl font-semibold text-gray-800">
                    | MasterList of DAF
                  </h1>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-4 text-sm">{index + 1}</td>
                        <td className="py-2 px-4 text-sm">
                          {item.firstname} {item.surname}
                        </td>
                        <td className="py-2 px-4 text-sm">{item.age}</td>
                        <td className="py-2 px-4 text-sm">
                          <div className="flex space-x-2">
                            <button
                              className="btn btn-sm bg-bttn hover:bg-bttn text-white"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-error text-white"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </button>
                            <button
                              className="btn btn-sm bg-blue-500 text-white"
                              onClick={() => fetchFamilyMembers(item.id)}
                            >
                              View Family
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Edit Form Modal */}
                {editingItem && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                      <h3 className="text-lg font-semibold">Edit Record</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.keys(formData).map((key) => (
                            <div className="mt-4" key={key}>
                              <label className="block capitalize">{key}</label>
                              <input
                                type={key === "dob" ? "date" : "text"}
                                value={formData[key]}
                                onChange={(e) =>
                                  setFormData({ ...formData, [key]: e.target.value })
                                }
                                className="w-full mt-2 p-2 border border-gray-300 rounded"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button
                            type="submit"
                            className="bg-bttn text-white px-4 py-2 rounded"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* View Family Modal */}
                {viewingFamilyMember && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                      <h3 className="text-lg font-semibold">Family Members</h3>
                      <ul>
                        {familyMemberData.map((member) => (
                    <li key={member.id} className="py-2 flex items-center justify-between">
                    <span>
                      •{member.fullname}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-sm bg-bttn hover:bg-bttn text-white"
                        onClick={() => familyedit(member)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error text-white"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                  
                        ))}
                      </ul>
                      <div className="mt-6 flex justify-end">
                        <button
                          className="bg-bttn text-white px-4 py-2 rounded"
                          onClick={() => setViewingFamilyMember(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

      {/* Edit Member Modal */}
      {showEditModal &&(
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold">Edit Family Member Details</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div> 
              <label>FullName</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />
              </div>
              <div>
              <label>Relationship</label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              /> </div>
           <div>   
           <label>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />  </div>
             <div>
             <label>Age</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />
             </div>
                  <div>
                  <label>Sex</label>
              <input
                type="text"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />
                  </div>
                  <div>
                  <label>Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />
                  </div>
                  <div>
                  <label>Occupation</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />
              
                  </div>
            
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowEditModal(false)}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleUpdateMember}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default MasterList;
