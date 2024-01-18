import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import Frame from '../../../Components/MainFrame/Frame';
const columns = [
    {
        field: 'lookupcode', headerName: 'Lookup Code', width: 150,
        valueGetter: ({ value }) => value && Number(value),
    },
    { field: 'description', headerName: 'Description', width: 250 },
    {
        field: 'new_price', headerName: 'New Price', width: 100,
        valueGetter: ({ value }) => value && Number(value),
    },
    {
        field: 'new_tierPriceC', headerName: 'New Tier PriceC', width: 100,
        valueGetter: ({ value }) => value && Number(value),
    },
    {
        field: 'new_orangePriceA', headerName: 'New Orange PriceA', width: 100,
        valueGetter: ({ value }) => value && Number(value),
    },
    {
        field: 'Margin', headerName: 'Margin', width: 100,
       
    },

    { field: 'name', headerName: 'Name', width: 200 },
    {
        field: 'ActionTime', headerName: 'ActionTime', type: 'dateTime', width: 200,
        valueGetter: ({ value }) => value && new Date(value),
        valueFormatter: ({ value }) => {
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
];




export default function ReportPrice() {
    const [rowsOfData, setRowsOfData] = useState([]);

    const [loading, setLoading] = useState(false);
    const getData = async () => {
        setLoading(true)
        let res = await axios.get("http://192.168.26.15/itemcreation-test/api/prices");
        setRowsOfData(res.data);
    }
    useEffect(() => {
        //call function to get data  
        getData();
        setLoading(false)
    }, []);
    useEffect(() => {
        if (rowsOfData.length > 0) {
            let btn = document.getElementsByClassName('MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall css-1pe4mpk-MuiButtonBase-root-MuiIconButton-root')[14];
            console.log(btn);
            btn.click()
        }
    }, [rowsOfData])
    console.log(rowsOfData)
    return (
        <>
            <div className='frame-container'>
                <Frame headerLabel="Report / prices">
                    <div className="row justify-content-between py-3 ">
                        <div
                            className="col-12 row  overflow-scroll align-content-start"
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