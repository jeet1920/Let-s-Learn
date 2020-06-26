// some pacakge or variable import
import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
const { Title } = Typography;
const { TextArea } = Input;

// define variable and properties
const Private = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];
const Catogory = [
  { value: 0, label: "ComputerScience" },
  { value: 0, label: "DataStruture" },
  { value: 0, label: "Algoritham" },
  { value: 0, label: "Python" },
];

// functional component
function UploadVideoPage(props) {
  // using State and hooks
  const user =useSelector(state=>state.user);
  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [privecy, setPrivecy] = useState(0);
  const [Categories, setCategories] = useState("computerScience");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [Thumbnail, setThumbnail] = useState("");
  
  // method for title
  const handleChangeTitle = (event) => {
    console.log(event.currentTarget.value);
    setTitle(event.currentTarget.value);
  };

  // method for decsription
  const handleChangeDecsription = (event) => {
    console.log(event.currentTarget.value);
    setDescription(event.currentTarget.value);
  };

  //method for privecy
  const handleChangeOne = (event) => {
    setPrivecy(event.currentTarget.value);
  };

  // method for catogory
  const handleChangeTwo = (event) => {
    setCategories(event.currentTarget.value);
  };

  // method on submit
  const onSubmit = (event) => {
    event.preventDefault();
    if(user.userData && !user.userData.isAuth){
      return alert('Please Log in First')
    }
    if(title==="" || Description==="" || Categories==="" || FilePath==="" || Duration ==="" || Thumbnail ===""){
      return alert('please first fill all the filed')
    }
    const variables={
      writer:user.userData._id,
      title:title,
      description:Description,
      privecy:privecy,
      filePath:FilePath,
      catogory:Categories,
      duration:Duration,
      thumbnail:Thumbnail,
    }
    axios.post('/api/video/uploadVideo',variables )
      .then(response=>{
        if(response.data.success){
            alert('video Uploaded Successfully')
            props.history.push('/')
        }else{
          alert('Failed to upload video')
        }
      })
  }; 
  // method for drop the files
  const onDrop = ( files ) => {

    let formData = new FormData();
    const config = {
        header: { 'content-type': 'multipart/form-data' }
    }
    console.log(files)
    formData.append("file", files[0])

    axios.post('/api/video/uploadfiles', formData, config)
    .then(response=> {
        if(response.data.success){

            let variable = {
                filePath: response.data.filePath,
                fileName: response.data.fileName
            }
            setFilePath(response.data.filePath)

            //gerenate thumbnail with this filepath ! 
             
            axios.post('/api/video/thumbnail', variable)
            .then(response => {
                if(response.data.success) {
                    setDuration(response.data.fileDuration)
                    setThumbnail(response.data.thumbsFilePath)
                } else {
                    alert('Failed to make the thumbnails');
                }
            })


        } else {
            alert('failed to save the video in server')
        }
    })

}

return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form onSubmit={onsubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Dropzone 
        onDrop={onDrop}
        multiple={false}
        maxSize={800000000}>
        {({ getRootProps, getInputProps }) => (
            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem' }} />

            </div>
        )}
    </Dropzone>

    {Thumbnail !== "" &&
        <div>
            <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
        </div>
    }
</div>

<br /><br />
<label>Title</label>
        <Input onChange={handleChangeTitle} value={title} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={handleChangeDecsription} value={Description} />
        <br />
        <br />
        <select onChange={handleChangeOne}>
          {Private.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={handleChangeTwo}>
          {Catogory.map((item, index) => (
            <option key={index} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UploadVideoPage;
