import React from 'react';
import Frame from '../../Components/MainFrame/Frame';
import { read, utils } from 'xlsx';
const KVIScreen = () => {
    const handleFileChange = (event) => {
        console.log('handleFileChange: ', event);
        console.log('files: ', event.target.files);
        const fileList = event.target.files;
        console.log('array: ', Array.isArray(fileList));

        // no file has been selected
        if (Object.keys(fileList).length === 0) return;

        const file = fileList[0]; // single file upload
        console.log('file: ', file);
        const reader = new FileReader();
        console.log(reader)
        reader.onload = (e) => {
            console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
            // e !== event
            console.log("e", e)
            //********************************************* */
            const bstr = e.target.result;
            console.log("bstr", bstr)
            const workBook = read(bstr, { type: 'binary' });
            console.log("workBook", workBook)
            const workSheetName = workBook.SheetNames[0];
            console.log("workSheetName", workSheetName)
            const workSheet = workBook.Sheets[workSheetName];
            console.log("workSheet", workSheet)
            const fileData = utils.sheet_to_json(workSheet, { header: 1 });
            console.log('fileData: ', fileData);
            let newFileData = fileData.map((arr) => Object.assign({}, arr));
            console.log(newFileData)
        };
        reader.readAsBinaryString(file);
        console.log('event.target.value: ', event.target.value);
        event.target.value = null;
    };

    return (
        <>
            <div className='frame-container position-relative'>
                <Frame headerLabel="KVI Screen">
                    <div className='file-container z-high position-relative bg-white p-2 mt-3 rounded  w-75 m-auto'>
                        <div className='d-flex justify-content-between'>
                            <label htmlFor="file">Upload Shelf Items </label>
                            <button className='border-0 bg-transparent fst-italic text-decoration-underline  '>Click here to download the template  </button>
                        </div>
                        <input onChange={handleFileChange}
                            type="file" name="file" id="file"
                            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        />
                    </div>
                </Frame>
                <div className="layer position-absolute top-0 bottom-0 left-0 right-0 bg-black opacity-50"></div>

            </div>

        </>

    );
}

export default KVIScreen;
