// Huisjes.jsx
import React, { useState, useEffect } from 'react';
import torensDAL from "./../DAL/torensDAL.js";
import huisjesDAL from "./../DAL/huisjesDAL.js";
import './../style/components/basicForm.scss';
import './../style/components/huisjes.scss';
import './../style/components/dialog.scss';

const Huisjes = () => {
  const [huisjesArray, setHuisjesArray] = useState([]);

  const [editHuisje, setEditHuisje] = useState(null);
  const [nieuwHuisje, setNieuwHuisje] = useState({ uid: '', toren: '', naam: '' });
  const [torensArray, setTorensArray] = useState([]);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [huisjeToDelete, setHuisjeToDelete] = useState(null);

  useEffect(() => {
    const fetchTorens = async () => {
      // Use the Read function from huisjeDAL
      const torensDALInstance = new torensDAL();

      // Use the functions from the torensDAL class
      torensDALInstance.readData()
        .then(result => {
          setTorensArray(result);
        });
    };

    const fetchHuisjes = async () => {
      // Use the Read function from huisjeDAL
      const huisjesDALInstance = new huisjesDAL();

      // Use the functions from the torensDAL class
      huisjesDALInstance.readData()
        .then(result => {
          setHuisjesArray(result);
        });
    };

    fetchTorens();
    fetchHuisjes();
  }, []);

  const handleToevoegen = async (newHuisje) => {
    if (nieuwHuisje.toren === '' || nieuwHuisje.naam === '' || nieuwHuisje.uid === '') {
      alert('Vul alle velden in voordat u een nieuw huisje toevoegt.');
      return;
    }
  
    try {
      const huisjesDALInstance = new huisjesDAL();
      await huisjesDALInstance.updateData(newHuisje.uid, newHuisje.toren, newHuisje.naam);
  
      // Fetch and update huisjesArray after the state has been updated
      const updatedHuisjesArray = await huisjesDALInstance.readData();
      setHuisjesArray(updatedHuisjesArray);
  
      // Reset the values in the input forms
      setNieuwHuisje({ uid: '', toren: '', naam: '' });
    } catch (e) {
      console.log(e);
      alert('Er is een fout opgetreden bij het toevoegen van het huisje.');
    }
  };
  

  const handleBijwerken = () => {
    const bijgewerkteHuisjes = huisjesArray.map(huis =>
      huis.id === editHuisje.id ? { ...huis, ...editHuisje } : huis
    );
    setHuisjesArray(bijgewerkteHuisjes);
    setEditHuisje(null);
  };

  const handleVerwijderen = (huis) => {
    setHuisjeToDelete(huis);
    setShowDeleteDialog(true);
  };

  const handleConfirmVerwijderen = async (huisjeToDeleteParameter) => {

    // If no valid huisje is passed as an argument
    if (!huisjeToDeleteParameter) {
      return;
    }

    const inputNaam = document.getElementById('huisInput').value.trim();

    // If the userinput does not match the name of the huisje
    if (!(inputNaam === huisjeToDeleteParameter.huisjesNaam)) {
      alert('De ingevoerde huisjesnaam komt niet overeen. Probeer opnieuw')
      return;
    }

    // delete the huisje from the database
    const huisjesDALInstance = new huisjesDAL();
    const response = huisjesDALInstance.deleteData(huisjeToDeleteParameter);

    // Fetch and update huisjesArray after the state has been updated
    const updatedHuisjesArray = await huisjesDALInstance.readData();
    setHuisjesArray(updatedHuisjesArray);

    setShowDeleteDialog(false);
    setHuisjeToDelete(null);
  };

  const handleCancelVerwijderen = () => {

    setShowDeleteDialog(false);
    setHuisjeToDelete(null);
  };

  return (
    <>
      <div className="container huisjes-container">
        <div className="row">

          {/* View */}
          <div className="col-12">
            <h1>Huisjes</h1>
            <div className="huisjes-list">
              {huisjesArray
              .filter(huis => huis.huisjesNaam && huis.torenNaam) // Exclude huisjes without huisjesNaam or torenNaam
              .map(huis => (
                <div key={huis.id} className="huisje-item">
                  {/* {console.log(huis)} */}
                  <span><b>{huis.torenNaam}</b></span>
                  <span>{huis.huisjesNaam}</span>
                  <button onClick={() => setEditHuisje(huis)}>Bijwerken</button>
                  <button onClick={() => handleVerwijderen(huis)}>Verwijderen</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr />
        <div className="row">

          {/* Add/Edit */}
          <div className="col-12">
            <div className="form huisje-form">
              <h2>{editHuisje ? 'Vogelhuisje bijwerken' : 'Vogelhuisje toevoegen'}</h2>
              <div className='wr-inputs'>
              {editHuisje ? null : (
                <div>
                  <label>UID:</label>
                  <select
                    value={nieuwHuisje.uid}
                    onChange={e => setNieuwHuisje({ ...nieuwHuisje, uid: e.target.value })}
                  >
                    <option value="" disabled>Selecteer een Huisje</option>
                    {huisjesArray
                      .filter(huisje => !(huisje.huisjesNaam || huisje.torenNaam))
                      .map((huisje, index) => (
                        <option key={index} value={huisje.device_id}>
                          {huisje.device_id}
                        </option>
                      ))}
                  </select>
                </div>
              )}

                <div>
                  <label>Toren:</label>
                  <select
                    value={editHuisje ? editHuisje.toren : nieuwHuisje.toren}
                    onChange={e => (editHuisje ? setEditHuisje({ ...editHuisje, toren: e.target.value }) : setNieuwHuisje({ ...nieuwHuisje, toren: e.target.value }))}
                  >
                    <option value="" disabled>Selecteer een toren</option>
                    {torensArray.map((toren, index) => (
                      <option key={index} value={toren.torenNaam}>
                        {toren.torenNaam}
                      </option>
                    ))}
                  </select>

                </div>
                <div>
                  <label>Naam:</label>
                  <input
                    type="text"
                    value={editHuisje ? editHuisje.naam : nieuwHuisje.naam}
                    onChange={e => (editHuisje ? setEditHuisje({ ...editHuisje, naam: e.target.value }) : setNieuwHuisje({ ...nieuwHuisje, naam: e.target.value }))}
                  />
                </div>
              </div>

              {editHuisje ? (
                <>
                  <button onClick={handleBijwerken}>Bijwerken</button>
                  <button onClick={() => setEditHuisje(null)}>Annuleren</button>
                </>
              ) : (
                <button onClick={() => handleToevoegen(nieuwHuisje)}>Toevoegen</button>
              )}
            </div>
          </div>
        </div>
      </div >
      {showDeleteDialog && (
        <>
          <div className="dialog-backdrop" />
          <dialog open={showDeleteDialog}>
            <h2>U staat op het punt om "{huisjeToDelete.huisjesNaam}" te verwijderen</h2>
            <p>Voer de naam van het huisje in om het te verwijderen.
              Alle bijbehorende meet data van dit huisje worden ook verwijderd.</p>
            <input className="select" type="text" name="huisje" id="huisInput" /><br />

            <button onClick={() => handleConfirmVerwijderen(huisjeToDelete)}>Ja</button>
            <button onClick={handleCancelVerwijderen}>Nee</button>
          </dialog>
        </>
      )
      };

    </>
  );
};

export default Huisjes;
