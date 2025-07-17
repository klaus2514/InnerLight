import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaVimeo, FaSpotify } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-light text-dark pt-5 border-top">
      <div className="container">
        <div className="row text-start">
          {/* Service Times */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Service Times</h6>
            <p className="mb-1">Wed 5:30pm</p>
            <p className="mb-1">Sat 5:30pm</p>
            <p className="mb-1">Sun 10:00am</p>
          </div>

          {/* Contact */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Contact</h6>
            <p className="mb-1">(000) 000-0000</p>
            <p className="mb-1">info@innerlight.com</p>
            <p className="mb-1">Contact Us</p>
          </div>

          {/* Location */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Location</h6>
            <p className="mb-1">1600 Peaceful Avenue</p>
            <p className="mb-1">Mindfulness City, IN 400001</p>
          </div>

          {/* Newsletter */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Stay Connected</h6>
            <div className="input-group mb-2">
              <input type="email" className="form-control" placeholder="name@email.com" />
              <button className="btn btn-dark">Subscribe</button>
            </div>
            <small className="text-muted">Subscribe to our newsletter for updates.</small>
          </div>
        </div>

        {/* Bottom row */}
        <div className="d-flex justify-content-between align-items-center border-top pt-3 pb-2 mt-4 flex-wrap">
          <div className="text-muted small">
            © 2025 InnerLight. All Rights Reserved. Template by <strong>T.RICKS</strong>
          </div>
          <div className="text-muted small">Privacy Policy</div>
          <div className="d-flex gap-3">
            <FaFacebookF />
            <FaYoutube />
            <FaInstagram />
            <FaTwitter />
            <FaVimeo />
            <FaSpotify />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
