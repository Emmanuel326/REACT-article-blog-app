import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate form submission delay
      setTimeout(() => {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitting(false);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
      }, 1500);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Contact Us</h1>
        <p className="subtitle">We’d love to hear from you! Fill out the form below.</p>

        {submitted && (
          <div className="notification is-success" aria-live="polite">
            ✅ Message sent successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                type="text"
                className="input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                aria-invalid={errors.name ? "true" : "false"}
              />
            </div>
            {errors.name && <p className="help is-danger">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>
            {errors.email && <p className="help is-danger">{errors.email}</p>}
          </div>

          {/* Message Field */}
          <div className="field">
            <label className="label">Message</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Write your message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                aria-invalid={errors.message ? "true" : "false"}
              ></textarea>
            </div>
            {errors.message && <p className="help is-danger">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="field">
            <div className="control">
              <button
                type="submit"
                className={`button is-primary ${isSubmitting ? "is-loading" : ""}`}
                disabled={isSubmitting}
              >
                Send Message
              </button>
            </div>
          </div>
        </form>

        {/* Contact Details */}
        <div className="content mt-5">
          <p>📍 Address: 123 Finance St, New York, NY</p>
          <p>📞 Phone: +1 234 567 890</p>
          <p>✉️ Email: contact@financeinsights.com</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
