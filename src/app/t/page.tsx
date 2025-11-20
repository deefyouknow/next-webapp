"use client";

export default function Page() {
  return (
    <>
      <style jsx global>{`
        @keyframes roll {
          0% {
            transform: rotateX(45deg) rotateY(-45deg);
          }
          25% {
            transform: rotateX(-45deg) rotateY(-45deg);
          }
          50% {
            transform: rotateX(45deg) rotateY(45deg);
          }
          75% {
            transform: rotateX(-45deg) rotateY(45deg);
          }
          100% {
            transform: rotateX(45deg) rotateY(-45deg);
          }
        }
        .animate-roll {
          animation: roll 13s infinite linear;
        }
        .box {
          height: 250px;
          width: 250px;
          text-align: center;
          border: 2px solid white;
          color: white;
          background-color: black;
          font-size: 1.875rem; /* text-3xl */
          box-sizing: border-box;
          position: absolute;
          transition: all 1s;
        }
      `}</style>

      <div className="w-full h-[100dvh] mx-auto [perspective:600px] bg-[radial-gradient(circle,theme(colors.gray.200),theme(colors.gray.400))]">
        <div className="relative h-[250px] w-[250px] mx-auto top-1/2 -translate-y-1/2 [transform-style:preserve-3d] animate-roll">
          {/* Front */}
          <div className="box [transform:translateZ(125px)]">
            <img
              src="https://picsum.photos/250/250?random=1"
              alt="Front face"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Back */}
          <div className="box [transform:translateZ(-125px) rotateY(180deg)]">
            <img
              src="https://picsum.photos/250/250?random=2"
              alt="Back face"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Left */}
          <div className="box [transform:rotateY(-90deg) translateX(-125px)]">
            <img
              src="https://picsum.photos/250/250?random=3"
              alt="Left face"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Right */}
          <div className="box [transform:rotateY(90deg) translateX(125px)]">
            <img
              src="https://picsum.photos/250/250?random=4"
              alt="Right face"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Top */}
          <div className="box [transform:rotateX(90deg) translateY(-125px)]">
            <img
              src="https://picsum.photos/250/250?random=5"
              alt="Top face"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Bottom */}
          <div className="box [transform:rotateX(-90deg) translateY(125px)]">
            <img
              src="https://picsum.photos/250/250?random=6"
              alt="Bottom face"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
