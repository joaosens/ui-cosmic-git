function StarTrigger({ onClick }) {
    return (
        <div onClick={onClick} style={
            {
                cursor: "pointer",
                fontSize: "3rem",
                textAlign: "center",
                marginTop: "40px",
            }}>
            ⭐ <p>Click to Reveal My Stats</p>
        </div>
    );
}

export default StarTrigger;
