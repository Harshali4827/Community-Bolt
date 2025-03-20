import React, { useEffect, useState } from "react";
import '../../../css/form.css';
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";

function UpdateUnit(){
const [formData, setFormData] = useState({
        property_id: '',
        property_sector_id: '',
        property_block_id : '',
        floor_number: '',
        unit_number: ''
      });
    
      const [errors, setErrors] = useState({});
      const [sectors, setSectors] = useState([]);
      const [blocks, setBlocks] = useState([]);
      const navigate = useNavigate();
      const {id} = useParams();

      useEffect(() => {
        fetchUnitData();
      },[id])
      
      useEffect(() => {
        const fetchSectors = async () => {
          try {
            const response = await axiosInstance.get('/sectors');
            setSectors(response.data);
          } catch (error) {
            console.error("Error fetching sectors:", error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to load sectors',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        };
    
        fetchSectors();
      }, []);

      useEffect(() => {
        const fetchBlocks = async () => {
          try {
            const response = await axiosInstance.get('/blocks');
            setBlocks(response.data);
          } catch (error) {
            console.error("Error fetching blocks:", error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to load blocks',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        };
    
        fetchBlocks();
      }, []);
    
      const fetchUnitData = async () => {
        try {
          const response = await axiosInstance.get(`/units/${id}`);
          console.log('Fetched data:', response.data);
          if (response.data) {
              setFormData(response.data);
            }
        } catch (error) {
          console.error('Error fetching sector data:', error);
        }
      };
  
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
      };

    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
      
        if (!formData.property_id) formErrors.property_id = 'Property id is required';

        if (!formData.property_sector_id ) formErrors.property_sector_id = 'Sector id is required';

        if (!formData.property_block_id ) formErrors.property_block_id = 'Block ID is required';
        
        if (!formData.floor_number ) formErrors.floor_number = 'Floor Number is required';
        
        if (!formData.unit_number) formErrors.unit_number = 'This Field is required';
        
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
      
        try {
          const response = await axiosInstance.put(`/units/${id}`,formData);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
      
          Toast.fire({
            icon: "success",
            title:"Data Saved Successfully!"
          });
      
          navigate('/units/units-list');
        } catch (error) {
          console.error("Error details:", error);
          if (error.response && error.response.status === 400) {
            Swal.fire({
              title: 'Error!',
              text: error.response.data.message,
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        }
      };

   const handleCancel = ()=> {
           navigate('/units/units-list') 
    }
    
  return(
  
    <div className="form-container">
      <div className="page-header">
      <div className="title">
        <p>Please Enter Valid Data</p>
     </div>
   <form onSubmit={handleSubmit}>
    <hr/>
    <div className="user-details">
       <div className="input-box">
          <div className="details-container">
          <span className="details">Property ID</span>
          <span className="required">*</span>
          </div>
          <input type="text" name="property_id" 
                 value={formData.property_id} onChange={handleChange}/>
          {errors.property_id && <p className="error">{errors.property_id}</p>}
        </div>

        <div className="input-box">
              <div className="details-container">
                <span className="details">Property Sector ID</span>
                <span className="required">*</span>
              </div>
              <select name="property_sector_id" value={formData.property_sector_id} onChange={handleChange}>
                <option value="">-Select Sector-</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.sector_name} (ID: {sector.id})
                  </option>
                ))}
              </select>
              {errors.property_sector_id && <p className="error">{errors.property_sector_id}</p>}
            </div>

      
            <div className="input-box">
              <div className="details-container">
                <span className="details">Property Block ID</span>
                <span className="required">*</span>
              </div>
              <select name="property_block_id" value={formData.property_block_id} onChange={handleChange}>
                <option value="">-Select Block-</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.block_name} (ID: {block.id})
                  </option>
                ))}
              </select>
              {errors.property_block_id && <p className="error">{errors.property_block_id}</p>}
            </div>

           <div className="input-box">
            <div className="details-container">
              <span className="details">Floor Number</span>
              <span className="required">*</span>
            </div>
            <input type="text" name="floor_number"  value={formData.floor_number} onChange={handleChange} />
            {errors.floor_number && <p className="error">{errors.floor_number}</p>}
        </div>

        <div className="input-box">
            <div className="details-container">
              <span className="details">Unit Number </span>
              <span className="required">*</span>
            </div>
            <input type="text" name="unit_number"  value={formData.unit_number} onChange={handleChange} />
            {errors.unit_number && <p className="error">{errors.unit_number}</p>}
        </div>
     </div>
     <hr/>
    <div className="button-row">
      <button type="submit" className="simple-button primary-button">Save</button>
      <button type="button" className="simple-button secondary-button" onClick={handleCancel} >Cancel</button>
     </div>
  </form>
</div>
</div>
  )
};
export default UpdateUnit;