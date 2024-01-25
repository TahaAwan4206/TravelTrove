function Modal({imageLink, tripPlan}) {
  return (

    <div className="modal-content">
  <div className="modal-header">
    <h2>Your Personalized Getaway Guide</h2>
  </div>
  <div className="modal-body">
  <div style={{textAlign: "center"}}>
        <img src={imageLink} style={{ width: "30%" }} alt="Logo" />
        <p>{tripPlan}</p>
    </div>
  </div>
  <div className="modal-footer">
    <h3>Press Anywhere to close</h3>
  </div>
</div>

  );
}

export default Modal;
