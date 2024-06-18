import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import { useState, useEffect, useRef } from 'react';
import styles from "./profile.module.css"


const getData = async (slug) => {
  const res = await fetch(`/api/profile/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

export default function EditButton({ slug }) {
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [inputWidth, setInputWidth] = useState('auto');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getData(slug);
        setData(result);
        setName(result.name);
        setImage(result.image);
        setInputWidth(calculateInputWidth(result.name));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  return (
    <div className={styles.gradientcustom2} style={{ backgroundColor: '#9de2ff' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          
   </MDBRow>
   </MDBContainer>

    </div>
  );
}