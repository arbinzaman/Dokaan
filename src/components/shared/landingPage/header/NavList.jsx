import { Download } from "lucide-react";
import { useLanguage } from "../../../../contexts/LanguageContext";

const NavList = ({ handleSectionNavigation, handleClick }) => {
  const { pick } = useLanguage();

  return (
    <nav className="hidden lg:flex items-center gap-6">
      <button
        type="button"
        onClick={() => handleSectionNavigation("features")}
        className="text-sm font-medium text-zinc-300 hover:text-red-400 transition-colors py-1"
      >
        {pick("All Features", "সব ফিচার")}
      </button>
      <button
        type="button"
        onClick={() => handleSectionNavigation("industries")}
        className="text-sm font-medium text-zinc-300 hover:text-red-400 transition-colors py-1"
      >
        {pick("Industries", "ব্যবসার ধরন")}
      </button>
      <button
        type="button"
        onClick={() => handleSectionNavigation("workflow")}
        className="text-sm font-medium text-zinc-300 hover:text-red-400 transition-colors py-1"
      >
        {pick("How It Works", "কাজের ধাপ")}
      </button>
      <button
        type="button"
        onClick={() => handleSectionNavigation("pricing")}
        className="text-sm font-medium text-zinc-300 hover:text-red-400 transition-colors py-1"
      >
        {pick("Pricing", "মূল্য তালিকা")}
      </button>
      <button
        type="button"
        onClick={() => handleSectionNavigation("faq")}
        className="text-sm font-medium text-zinc-300 hover:text-red-400 transition-colors py-1"
      >
        {pick("FAQ", "প্রশ্নোত্তর")}
      </button>
      <a
        href="https://drive.google.com/file/d/1UwUeq3zu8N2VvGk59ReNgPiowpCvMKS9/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 transition-colors py-1"
      >
        <Download size={15} />
        {pick("Android App", "অ্যান্ড্রয়েড অ্যাপ")}
      </a>
    </nav>
  );
};

export default NavList;
