import React from 'react';
import Select from 'react-select'
import Frame from '../../Components/MainFrame/Frame';
import { useNavigate } from 'react-router-dom';

// const options = [
//     { value: 'product', label: 'Products Report' },
//     { value: 'cost', label: 'Cost Report' },
//     { value: 'price', label: 'Prices Report' },
//     { value: 'approval', label: 'Approvals Report' },

// ]

const Report = (props) => {
    console.log('reports', props.reportData);
    // let options = props.reportData.map((item) => {
    //     let obj = {}
    //     obj.label = item.value;
    //     obj.value = item.lable;
    //     return obj
    // })
    // console.log("options" , options)
    let navigate = useNavigate()
    const onChangeHandler = (e) => {
        console.log(e);
        navigate(`./${e.value}`);
    }
    return (
        <>
            <div className='frame-container position-relative'>
                <Frame headerLabel="Report">
                    <div className='select_container h-100  d-flex'>
                        <div className='w-50 m-auto select_container'>
                            <Select options={props.reportData} onChange={onChangeHandler} />
                        </div>

                    </div>
                </Frame>
                <div className="layer position-absolute top-0 bottom-0 left-0 right-0 bg-black opacity-50"></div>
            </div>
        </>
    );
}
export default Report;
