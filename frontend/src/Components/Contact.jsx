import React, { useState } from "react";
import { contactPageStyles as styles } from "../assets/dummyStyles";
import {
  FaClock,
  FaEnvelope,
  FaMapMarkedAlt,
  FaWhatsapp,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaCar,
  FaComment,
} from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carType: "",
    message: "",
  });

  const [activeField, setActiveField] = useState(null);

  const handleFocus = (field) => setActiveField(field);
  const handleBlur = () => setActiveField(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Car Type: ${formData.carType}
Message: ${formData.message}
    `;

    const whatsappURL = `https://wa.me/919088085886?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");

    setFormData({
      name: "",
      email: "",
      phone: "",
      carType: "",
      message: "",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.cardContainer}>
          {/* INFO CARD */}
          <div className={styles.infoCard}>
            <div className="relative z-19 space-y-5">
              <h2 className={styles.infoTitle}>
                <FaMapMarkedAlt className={styles.infoIcon} /> Our Information
              </h2>

              <div className={styles.infoItemContainer}>
                {[
                  {
                    icon: FaWhatsapp,
                    label: "WhatsApp",
                    value: "9088085886",
                    color: "bg-green-900/30",
                  },
                  {
                    icon: FaEnvelope,
                    label: "Email",
                    value: "abhishekjha24450@gmail.com",
                    color: "bg-orange-900/30",
                  },
                  {
                    icon: FaClock,
                    label: "Hours",
                    value: "Mon-Sat: 8AM-8PM",
                    color: "bg-orange-900/30",
                  },
                ].map((info, i) => (
                  <div key={i} className={styles.infoItem}>
                    <div className={styles.iconContainer(info.color)}>
                      <info.icon
                        className={
                          i === 0
                            ? "text-green-400 text-lg"
                            : "text-orange-400 text-lg"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={styles.infoLabel}>{info.label}</h3>
                      <p className={styles.infoValue}>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.offerContainer}>
                <div className="flex items-center">
                  <FaCalendarAlt className={styles.offerIcon} />
                  <span className={styles.offerTitle}>Special Offer!</span>
                </div>
                <p className={styles.offerText}>
                  Book for 3+ days and get 10% discount.
                </p>
              </div>
            </div>
          </div>

          {/* FORM CARD */}
          <div className={styles.formCard}>
            <div className={styles.formCircle1}></div>
            <div className={styles.formCircle2}></div>

            <div className="mb-4">
              <h2 className={styles.formTitle}>
                <IoIosSend className={styles.infoIcon} />
              </h2>
              <p className={styles.formSubtitle}>
                Fill out the form and we'll get back to you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {["name", "email", "phone", "carType"].map((field) => {
                  const icons = {
                    name: FaUser,
                    email: FaEnvelope,
                    phone: FaPhone,
                    carType: FaCar,
                  };

                  const placeholders = {
                    name: "Full Name",
                    email: "Email Address",
                    phone: "Phone Number",
                    carType: "Select Car Type",
                  };

                  return (
                    <div key={field} className={styles.inputContainer}>
                      <div className={styles.inputIcon}>
                        {React.createElement(icons[field])}
                      </div>

                      {field !== "carType" ? (
                        <input
                          type={
                            field === "email"
                              ? "email"
                              : field === "phone"
                              ? "tel"
                              : "text"
                          }
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          onFocus={() => handleFocus(field)}
                          onBlur={handleBlur}
                          required
                          placeholder={placeholders[field]}
                          className={styles.input(activeField === field)}
                        />
                      ) : (
                        <select
                          name="carType"
                          value={formData.carType}
                          onChange={handleChange}
                          onFocus={() => handleFocus(field)}
                          onBlur={handleBlur}
                          required
                          className={styles.input(activeField === field)}
                        >
                          <option value="">Select Car Type</option>
                          {[
                            "Economy",
                            "SUV",
                            "Luxury",
                            "Van",
                            "Sports Car",
                            "Convertible",
                          ].map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="relative">
                <div className={styles.textareaIcon}>
                  <FaComment />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus("message")}
                  onBlur={handleBlur}
                  required
                  rows="3"
                  placeholder="Tell us about your rental needs..."
                  className={styles.textarea(activeField === "message")}
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Send Message
                <FaWhatsapp className={styles.whatsappIcon} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
