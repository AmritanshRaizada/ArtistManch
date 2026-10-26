import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest py-10 mt-auto">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            </div>
            <span className="font-playfair text-[18px] text-on-surface">ArtistManch</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/" className="text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider">Home</Link>
            <Link to="/browse" className="text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider">Browse Artists</Link>
            <Link to="/join" className="text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider">Join as Artist</Link>
            <a href="#" className="text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider">Privacy Policy</a>
            <a href="#" className="text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider">Terms of Service</a>
            <a href="#" className="text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider">Refund & Cancellation</a>
          </div>
        </div>
        <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="text-[13px] text-on-surface-variant">© 2025 ArtistManch Entertainment Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
