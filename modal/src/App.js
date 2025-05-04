import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState } from 'react';
import Draft from './draft.js';

function App() {

  const [show, setShow] = useState(false);
  const [color, setColor] = useState('olive');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log(color);
  
  return (
    <div className="">
      <div style={{backgroundColor:{color}}}>
        <button type='button' className='btn btn-primary' 
        onClick={()=>setColor("#5ff555")}>Light Greeb</button>
        
        <button type='button' className='btn btn-success' 
        onClick={()=>setColor("green")}>GREEN</button>

        <button type='button' className='btn btn-danger' 
        onClick={()=>setColor("red")}>RED</button>
        <Draft color={color} />
      </div>
      <button type="button" className="btn btn-info btn-lg text-bold" onClick={handleShow}>
        Launch Modal
      </button>

      {show && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal title</h5>
                <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Modal body text goes here.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
