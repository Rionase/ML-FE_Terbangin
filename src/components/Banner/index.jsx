import Banner from "../../assets/newBanner.svg";

const banner = () => {
  return (
    <div
      className="position-relative mt-5"
      style={{
        backgroundColor: "#b892da",
        height: "250px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        top: "25px",
      }}
    >
      <img
        src={Banner}
        alt="Banner"
        style={{
          height: "300px",
          position: "relative",
          bottom: "25px",
        }}
      />
    </div>
  );
};

export default banner;
