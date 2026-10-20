import React, { useState } from "react";
import { 
  X, ArrowRight, ArrowLeft, Check, Sprout, CloudRain, 
  Layers, ShieldCheck, Sparkles 
} from "lucide-react";

export default function OnboardingModal({
  isOpen,
  onClose,
  onFinish,
  language = "en"
}) {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(0);

  const slides = {
    en: [
      {
        icon: CloudRain,
        iconBg: "bg-sky-100 text-sky-700",
        badge: "Core Innovation",
        title: "Weather is an Input, Not the Output",
        desc: "Farmers don't need another confusing rain chart. Our system automatically turns satellite forecasts into clear, binary sowing decisions to protect your ₹15,000–₹40,000 seed investment.",
        highlight: "Real-time Open-Meteo satellite weather telemetry"
      },
      {
        icon: Layers,
        iconBg: "bg-emerald-100 text-emerald-700",
        badge: "Soil & Microclimate",
        title: "Calibrated to Your Specific Plot",
        desc: "A 30mm rainfall is enough for light soil, but heavy black regur soil requires 50mm+ before sowing. We calibrate ICAR agro-climatic rules to your exact soil type and irrigation setup.",
        highlight: "Deep black, medium loam & light soil intelligence"
      },
      {
        icon: ShieldCheck,
        iconBg: "bg-amber-100 text-amber-700",
        badge: "Financial Shield",
        title: "Compare 4 Ranked Options",
        desc: "Don't guess. Instantly compare Sow Now, Wait a Few Days, Irrigate & Sow, or Switch to a Resilient Crop (Millets/Tur) with quantified dry-gap risk scores.",
        highlight: "Multi-option risk minimization matrix"
      }
    ],
    mr: [
      {
        icon: CloudRain,
        iconBg: "bg-sky-100 text-sky-700",
        badge: "मुख्य वैशिष्ट्य",
        title: "हवामान हे केवळ इनपुट आहे, निकाल नाही",
        desc: "शेतकऱ्यांना केवळ पावसाचे आलेख नकोत. आमची प्रणाली उपग्रह हवामान अंदाज वापरून तुमचे ₹१५,००० ते ₹४०,००० चे बियाणे व खत वाया जाण्यापासून वाचवण्यासाठी अचूक पेरणी सल्ला देते.",
        highlight: "थेट उपग्रह रडार आणि हवामान विश्लेषण"
      },
      {
        icon: Layers,
        iconBg: "bg-emerald-100 text-emerald-700",
        badge: "जमीन आणि ओलावा",
        title: "तुमच्या शेताच्या जमिनीनुसार सल्ला",
        desc: "हलक्या जमिनीत ३० मिमी पाऊस पुरेसा ठरतो, पण भारी काळ्या जमिनीत पेरणीसाठी ५० मिमी+ ओल लागते. आम्ही तुमच्या जमिनीच्या प्रकारानुसार ICAR मार्गदर्शक तत्त्वे लागू करतो.",
        highlight: "काळी कसदार, मध्यम व हलकी जमीन अचूकता"
      },
      {
        icon: ShieldCheck,
        iconBg: "bg-amber-100 text-amber-700",
        badge: "आर्थिक सुरक्षा",
        title: "४ पर्यायांची तुलना करून सुरक्षित निर्णय",
        desc: "अंदाज लावू नका. आता पेरणी करा, काही दिवस थांबा, सिंचन देऊन पेरा किंवा पर्यायी पीक (बाजरी/तूर) निवडा या ४ पर्यायांची जोखीम तपासून निर्णय घ्या.",
        highlight: "पावसाचा खंड व जोखीम निवारण प्रणाली"
      }
    ],
    hi: [
      {
        icon: CloudRain,
        iconBg: "bg-sky-100 text-sky-700",
        badge: "मुख्य नवाचार",
        title: "मौसम केवल इनपुट है, अंतिम निर्णय नहीं",
        desc: "किसानों को केवल वर्षा चार्ट की आवश्यकता नहीं है। हमारा सिस्टम सैटेलाइट मौसम डेटा का विश्लेषण कर आपके ₹१५,००० से ₹४०,००० के बीज खर्च को सुरक्षित रखने के लिए स्पष्ट बुवाई निर्णय देता है।",
        highlight: "लाइव सैटेलाइट मौसम डेटा और विश्लेषण"
      },
      {
        icon: Layers,
        iconBg: "bg-emerald-100 text-emerald-700",
        badge: "मिट्टी और नमी",
        title: "आपकी खेत की मिट्टी के अनुसार सटीक सलाह",
        desc: "हल्की मिट्टी में ३० मिमी बारिश पर्याप्त है, लेकिन भारी काली मिट्टी में बुवाई के लिए ५० मिमी+ बारिश जरूरी है। हम आपकी मिट्टी और सिंचाई के अनुसार ICAR नियमों का पालन करते हैं।",
        highlight: "काली उपजाऊ, मध्यम और हल्की मिट्टी के अनुकूल"
      },
      {
        icon: ShieldCheck,
        iconBg: "bg-amber-100 text-amber-700",
        badge: "वित्तीय सुरक्षा",
        title: "४ विकल्पों की तुलना और कम जोखिम",
        desc: "अनुमान मत लगाइए। अभी बुवाई करें, कुछ दिन प्रतीक्षा करें, सिंचाई देकर बुवाई करें, या वैकल्पिक फसल (बाजरा/अरहर) चुनें - इन ४ विकल्पों की तुलना करें।",
        highlight: "शुष्क दौर और जोखिम प्रबंधन प्रणाली"
      }
    ]
  };

  const currentSlides = slides[language] || slides.en;
  const slide = currentSlides[currentStep];
  const Icon = slide.icon;
  const isLast = currentStep === currentSlides.length - 1;

  const handleNext = () => {
    if (isLast) {
      if (onFinish) onFinish();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header bar with Skip */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            {currentSlides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? "w-6 bg-emerald-600" : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg cursor-pointer"
          >
            Skip
          </button>
        </div>

        {/* Content Card */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          <div className={`w-20 h-20 rounded-3xl ${slide.iconBg} mx-auto flex items-center justify-center shadow-inner`}>
            <Icon className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {slide.badge}
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
              {slide.title}
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {slide.desc}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-left flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold text-slate-700">
              {slide.highlight}
            </span>
          </div>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <span>{isLast ? "Get Started" : "Continue"}</span>
            {isLast ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
