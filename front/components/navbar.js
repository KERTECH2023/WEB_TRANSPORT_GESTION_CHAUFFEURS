import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  FaMapMarkerAlt,
  FaMobileAlt,
  FaRegClock,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaBars,
} from "react-icons/fa";
import Image from "next/legacy/image";
import imgbg from "../public/bgnv.jpg";


const Navbar = () => {
  const [activeLink, setActiveLink] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const lastActivityTime = useRef(new Date().getTime());

  useEffect(() => {
    const loggedIn = window.localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");

    if (!loggedIn && router.pathname === "/profile" && !redirected) {
      router.push("/Auth");
      setRedirected(true);
    }
  }, [isLoggedIn, router, redirected]);

  useEffect(() => {
    const loggedIn = window.localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");

    const updateActivityTime = () => {
      lastActivityTime.current = new Date().getTime();
    };

    window.addEventListener("mousemove", updateActivityTime);
    window.addEventListener("keydown", updateActivityTime);

    return () => {
      window.removeEventListener("mousemove", updateActivityTime);
      window.removeEventListener("keydown", updateActivityTime);
    };
  }, []);

  useEffect(() => {
    const checkInactivity = setInterval(() => {
      const currentTime = new Date().getTime();
      const inactiveDuration = currentTime - lastActivityTime.current;
      const inactivityThreshold = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

      if (inactiveDuration >= inactivityThreshold && isLoggedIn) {
        logout();
      }
    }, 1000);

    return () => {
      clearInterval(checkInactivity);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const loggedIn = window.localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");

    if (!loggedIn && router.pathname === "/histo" && !redirected) {
      router.push("/Auth");
      setRedirected(true);
    }
  }, [isLoggedIn, router, redirected]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setShowMenu(false); // Close the menu on link click
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const logout = () => {
    window.localStorage.clear();
    setIsLoggedIn(false);
    router.push("/Auth");
  };

  const handleButtonClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      router.push("/Auth");
    }
  };

  useEffect(() => {
    const loggedIn = window.localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
  }, [handleButtonClick]);

  return (
    <nav
      className="p-4 shadow-lg relative z-50"
      style={{
        backgroundImage: `url(${imgbg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto  flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="flex  items-center ml-24 w-20 h-20">
            <Image src="https://firebasestorage.googleapis.com/v0/b/prd-transport.appspot.com/o/logoc.png?alt=media&token=6a225136-94c5-407b-8501-c233e9aa721f" alt="Logo" className="  rounded-full" />
          </a>
        </Link>
        <div
          className={`md:flex ${
            showMenu ? "block" : "hidden"
          } absolute md:relative bg-darkGray md:bg-transparent top-16 md:top-auto right-0 md:right-auto w-full md:w-auto`}
        >
          <Link href="/" legacyBehavior>
            <a
              className={`block md:inline-block text-white font-bold text-xl px-4 py-2 rounded-md hover:bg-gold`}
              onClick={() => handleLinkClick("Accueil")}
            >
              Accueil
            </a>
          </Link>

          {!isLoggedIn && (
            <>
              <Link href="/Conducteur" legacyBehavior>
                <a
                  className={`block md:inline-block text-white font-bold text-xl px-4 py-2 rounded-md bg-gold shadow-[0_4px_10px_rgba(255,255,255,0.7)]  `}
                  onClick={() => handleLinkClick("Devenir Conducteur")}
                >
                  Devenir Conducteur
                </a>
              </Link>
              <Link href="/Transfertaeroport" legacyBehavior>
                <a
                  className={`block md:inline-block text-white font-bold text-xl px-4 py-2 rounded-md ${
                    activeLink === "Transfertaeroport"
                      ? "bg-gold"
                      : "hover:bg-gold"
                  }`}
                  onClick={() => handleLinkClick("Transfert aeroport")}
                >
                  Transfert Aéroport
                </a>
              </Link>
              <Link href="/contact" legacyBehavior>
                <a
                  className={`block md:inline-block text-white font-bold text-xl px-4 py-2 rounded-md hover:bg-gold`}
                  onClick={() => handleLinkClick("Contact")}
                >
                  Contactez-nous
                </a>
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link href="/profile" legacyBehavior>
                <a
                  className={`block md:inline-block text-white font-bold text-xl px-4 py-2 rounded-md ${
                    activeLink === "Profile" ? "bg-gold" : "hover:bg-gold"
                  }`}
                  onClick={() => handleLinkClick("Profile")}
                >
                  PROFILE
                </a>
              </Link>
              <Link href="/histo" legacyBehavior>
                <a
                  className={`block md:inline-block text-white font-bold text-xl px-4 py-2 rounded-md ${
                    activeLink === "History" ? "bg-gold" : "hover:bg-gold"
                  }`}
                  onClick={() => handleLinkClick("History")}
                >
                  HISTORIQUE
                </a>
              </Link>
              {/* Demander Taxi Button for Logged-in Users */}
              <Link href="/Transfertaeroport" legacyBehavior>
                <a
                  className={`block md:inline-block text-white font-bold text-xl px-4 py-2 rounded-md ${
                    activeLink === "Transfert Aéroport"
                      ? "bg-gold shadow-[0_4px_10px_rgba(255,255,255,0.7)]"
                      : "hover:bg-gold shadow-[0_4px_10px_rgba(255,255,255,0.7)]"
                  } transition-shadow`}
                  onClick={() => handleLinkClick("Transfert Aéroport")}
                >
                  Transfert Aéroport
                </a>
              </Link>
              <Link href="/contact" legacyBehavior>
                <a
                  className={`block md:inline-block text-white font-bold text-xl px-4 py-2 rounded-md hover:bg-gold`}
                  onClick={() => handleLinkClick("Contact")}
                >
                  Contactez-nous
                </a>
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="ml-4 px-4 py-2 border-2 border-gold rounded-md text-white font-bold text-xl hover:bg-gold hover:text-white transition"
          onClick={handleButtonClick}
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
        <div
          className="text-white text-2xl cursor-pointer md:hidden"
          onClick={toggleMenu}
        >
          <FaBars />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
