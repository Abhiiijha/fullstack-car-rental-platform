import React from "react";
import { footerStyles as styles } from "../assets/dummyStyles";
import logo from "../assets/logocar.png";


import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaPhone,
  FaMapMarkedAlt,
} from "react-icons/fa";

import { GiCarKey } from "react-icons/gi";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.topElements}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.roadLine} />
      </div>

      <div className={styles.innerContainer}>
        <div className={styles.grid}>
          {/* BRAND */}
          <div className={styles.brandSection}>
            <Link to="/" className="flex items-center">
              <div className={styles.logoContainer}>
                <img
                  src={logo}
                  alt="KARZONE logo"
                  className="h-[1em] w-auto block"
                  style={{ objectFit: "contain" }}
                />
                <span className={styles.logoText}>KARZONE</span>
              </div>
            </Link>

            <p className={styles.description}>
              Premium car rental service with the latest models and exceptional
              customer service. Drive your dream car today!
            </p>

            <div className={styles.socialIcons}>
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube].map(
                (Icon, i) => (
                  <a
                    href="#"
                    key={i}
                    className={styles.socialIcon}
                    aria-label="social-link"
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className={styles.sectionTitle}>
              Quick Links <span className={styles.underline} />
            </h3>

            <ul className={styles.linkList}>
              <li>
                <Link to="/" className={styles.linkItem}>
                  <span className={styles.bullet} /> Home
                </Link>
              </li>
              <li>
                <Link to="/cars" className={styles.linkItem}>
                  <span className={styles.bullet} /> Cars
                </Link>
              </li>
              <li>
                <Link to="/contact" className={styles.linkItem}>
                  <span className={styles.bullet} /> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className={styles.sectionTitle}>
              Contact Us <span className={styles.underline} />
            </h3>

            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <FaMapMarkedAlt className={styles.contactIcon} />
                <span>123 Ras Bihari Avenue, Kolkata - 700038</span>
              </li>

              <li className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <span>+91 1234567890</span>
              </li>

              <li className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} />
                <span>abhishekjha24450@gamil.com</span>
              </li>
            </ul>

            <div className={styles.hoursContainer}>
              <h4 className={styles.hoursTitle}>Business Hours</h4>
              <div className={styles.hoursText}>
                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p>Saturday: 9:00 AM - 6:00 PM</p>
                <p>Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className={styles.sectionTitle}>
              Newsletter <span className={styles.underline} />
            </h3>

            <p className={styles.newsletterText}>
              Subscribe for special offers and updates
            </p>

            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your Email Address"
                className={styles.input}
                required
              />

              <button type="submit" className={styles.subscribeButton}>
                <GiCarKey className="mr-2 text-lg sm:text-xl" />
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className={styles.copyright}>
          <p>
            &copy; {new Date().getFullYear()} KARZONE. All rights reserved.
          </p>
          <p className="mt-3 md:mt-0">Designed by Abhishek Jha</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
