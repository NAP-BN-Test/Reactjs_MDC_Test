import './App.css';
import React, { useEffect, useState } from 'react';
import { KeyOutlined, LockOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message, Upload, Form, Input, Select } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Option } from 'antd/es/mentions';
import axios from 'axios';

function App() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [chooseProvince, setChooseProvince] = useState();
  const [chooseDistrict, setChooseDistrict] = useState();
  const [chooseWard, setChooseWard] = useState();
  const [address, setAddress] = useState('');
  const [resultSearch, setResultSearch] = useState([]);

  useEffect(() => {
    getProvince()
  }, [])
  function getProvince() {
    axios.get(`http://localhost:3000/province`)
      .then(res => {
        const _province = res.data;
        console.log(_province.data);
        setProvince(_province.data)
      })
      .catch(error => console.log(error));
  }
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file as RcFile);
    });
    console.log(formData);

    // setUploading(true);
    // // You can use any AJAX library you like
    // fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     setFileList([]);
    //     message.success('upload successfully.');
    //   })
    //   .catch(() => {
    //     message.error('upload failed.');
    //   })
    //   .finally(() => {
    //     setUploading(false);
    //   });
  };
  function selectProvince(value: any) {
    setChooseProvince(value);
    axios.get(`http://localhost:3000/district/` + value)
      .then(res => {
        const _district = res.data;
        console.log(_district.data);
        setDistrict(_district.data)
      })
      .catch(error => console.log(error));
  }
  function selectDistrict(value: any) {
    setChooseDistrict(value);
    axios.get(`http://localhost:3000/ward/` + value)
      .then(res => {
        const _district = res.data;
        console.log(_district.data);
        setWard(_district.data)
      })
      .catch(error => console.log(error));
  }
  function searchKeyword(value: any) {
    axios.get(`http://localhost:3000/search/` + value.target.value)
      .then(res => {
        const results = res.data;
        console.log(results.data);
        setResultSearch(results.data)
      })
      .catch(error => console.log(error));
  }
  function handleAddress(value: any) {
    value.preventDefault();
    setAddress(value.target.value);
  }
  function selectWard(value: any) {
    setChooseWard(value);
  }
  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  return (
    <div className="App">
      {/* <header className="App-header">
        <p>
          Test MDC
        </p>
      </header> */}
      <div className="App-body">
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          style={{ marginTop: 10 }}
        >
          <Form.Item
            label="Tỉnh/Thành Phố"
            name="province"
          >
            <Select
              placeholder="Please input your username!"
              allowClear
              onChange={selectProvince}
            >
              {province.map((item: any) => (
                <Option value={item.id}>{item.provinceName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Quận Huyện"
            name="district"
          >
            <Select
              placeholder="Please input your username!"
              allowClear
              onChange={selectDistrict}
            >
              {district.map((item: any) => (
                <Option value={item.id}>{item.districtName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Xã Phường"
            name="ward"
          >
            <Select
              placeholder="Please input your username!"
              allowClear
              onChange={selectWard}
            >
              {ward.map((item: any) => (
                <Option value={item.id}>{item.wardName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
          >
            <Input
              placeholder="Please input address"
              allowClear
              onChange={handleAddress}
            />
          </Form.Item>
          <Form.Item
            label="Tìm xã"
            name="keyword"
          >
            <Input
              placeholder="Please input address"
              allowClear
              onChange={searchKeyword}
            />
          </Form.Item>
          {resultSearch.map((item:any) => (
            <p>{item.wardName}</p>
          ))}
        </Form>
        <p>{`${chooseProvince}, ${chooseDistrict}, ${chooseWard}, ${address}`}</p>
      </div>
    </div>
  );
}

export default App;
