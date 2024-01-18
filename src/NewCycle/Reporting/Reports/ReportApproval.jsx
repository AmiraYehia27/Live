import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import Frame from '../../../Components/MainFrame/Frame';
import { useDemoData } from '@mui/x-data-grid-generator';



const columns = [
    {
        field: 'lookupcode', headerName: 'Lookup Code', width: 110,
        valueGetter: ({ value }) => value && Number(value),
    },
    { field: 'description', headerName: 'Description', width: 150 },
    { field: 'Department', headerName: 'Department', width: 150 },
    { field: 'Category', headerName: 'Category', width: 100 },
    {
        field: 'Cost', headerName: 'Cost', width: 60,
        valueGetter: ({ value }) => value && Number(value),
    },
    {
        field: 'VAT', headerName: 'VAT', width: 50,

    },
    {
        field: 'Price', headerName: ' Price', width: 50,
        valueGetter: ({ value }) => value && Number(value),
    },
    { field: 'Username', headerName: 'User Name', width: 100 },

    {
        field: 'online', headerName: 'Web', width: 50,
        valueGetter: ({ value }) => value == 0 ? 'offline' : 'online',
        renderCell: ({ value }) => (
            <i className={`shadow fa-solid fa-circle ${value == 'online' ? 'text-success' : "text-danger"}`}></i>
        ),
    },
    {
        field: 'ActionTime', headerName: 'ActionTime', type: 'dateTime', width: 140,
        valueGetter: ({ value }) => value && new Date(value),
        valueFormatter: ({ value }) => {
            let dat = new Date();
            // dat.toLocaleTimeString
            // console.log(C)
            if (value) {
                console.log(value.to)
                function padTo2Digits(num) {
                    return num.toString().padStart(2, '0');
                }
                let arr = [padTo2Digits(value.getDate()),
                padTo2Digits(value.getMonth() + 1),
                value.getFullYear(),]
                return arr.join('/') + " " + value.toLocaleTimeString()
            }
        }
    },
    {
        field: 'rmsID', headerName: 'RMS availability', width: 100,
        valueGetter: ({ value }) => value == 0 ? 'not-available' : 'available',
        renderCell: ({ value }) => (
            <i className={`fs-4   fa-solid  ${value == 'available' ? ' fa-check text-success ' : "fa-xmark text-danger"}`}></i>
        ),
    },
];




export default function ReportApproval() {
    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 100000,
        editable: true,
    });
    console.log(data)
    const [rowsOfData, setRowsOfData] = useState([]);

    const [loading, setLoading] = useState(false);
    const getData = async () => {
        setLoading(true)
        let res = await axios.get("http://192.168.26.15/itemcreation-test/api/approvals");
        setRowsOfData(res.data);

    }
    useEffect(() => {
        //call function to get data  
        getData();
        setLoading(false)
    }, []);
    useEffect(() => {
        if (rowsOfData.length > 0) {
            let btn = document.getElementsByClassName('MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall css-1pe4mpk-MuiButtonBase-root-MuiIconButton-root')[18];
            console.log(btn);
            btn.click()
        }
    }, [rowsOfData])
    console.log(rowsOfData)

    return (
        <>
            <div className='frame-container position-relative'>
                <Frame headerLabel="Report / Approvals">
                    <div className="row justify-content-between py-3">
                        <div
                            className="col-12 row  overflow-scroll align-content-start "
                        >
                            <div style={{ height: '100vh', width: '100%', fontSize: '10px', margin: 'auto' }} className=' position-relative z-high bg-white opacity-90 py-3 rounded'>
                                <DataGrid
                                    slots={{ toolbar: GridToolbar }}
                                    rows={rowsOfData}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                    }}
                                    pageSizeOptions={[5, 10, 50, 100]}
                                    loading={loading}
                                    checkboxSelection
                                />
                            </div>
                        </div>
                    </div>
                </Frame>
                <div className="layer position-absolute top-0 bottom-0 left-0 right-0 bg-black opacity-25"></div>

            </div>

        </>

    );
}