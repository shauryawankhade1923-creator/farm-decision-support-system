"""
AI Explainer & Multilingual Localization Module.

Features:
1. Isolated template-driven generator for plain-language, jargon-free explanations.
2. Multilingual translation dictionary for English, Marathi (मराठी), and Hindi (हिंदी).
3. Optional plug-in adapter for external LLMs (Claude / Gemini) if an API key is provided in the future.
"""

import os
from typing import Dict, Any, Optional

TRANSLATIONS = {
    "mr": {
        "SOW NOW": "आता पेरणी करा",
        "WAIT": "काही दिवस थांबा",
        "CONSIDER ANOTHER CROP": "दुसऱ्या पिकाचा विचार करा",
        "High": "जास्त धोका",
        "Medium": "मध्यम धोका",
        "Low": "कमी धोका (सुरक्षित)",
        "Recommended": "शिफारस केलेले",
        "Not available": "उपलब्ध नाही",
        "Sow Today": "आजच पेरणी करा",
        "Wait 3-4 Days": "३ ते ४ दिवस थांबा",
        "Irrigate & Sow Tomorrow": "सिंचन देऊन उद्या पेरणी करा",
        "Change Crop": "दुसरे पीक निवडा",
        "wait_reason_mr": "आज पाऊस अपेक्षित असला तरी पुढील ५ दिवसांत पावसाचा मोठा खंड पडण्याची शक्यता आहे. बियाणे उगवण्यासाठी जमिनीत सलग ओलावा आवश्यक आहे. काही दिवस थांबल्यास बियाणे वाया जाण्याचा धोका टळेल.",
        "sow_reason_mr": "सध्याचे हवामान आणि पावसाचा अंदाज पाहता जमिनीत पुरेसा ओलावा उपलब्ध राहील. बियाणे उगवणीसाठी परिस्थिती अनुकूल आहे.",
        "alt_reason_mr": "हवामानाचा लहरीपणा पाहता या पिकासाठी धोका जास्त आहे. कमी पाण्यावर येणाऱ्या पर्यायी पिकाची निवड करणे अधिक फायदेशीर ठरेल."
    },
    "hi": {
        "SOW NOW": "अभी बुवाई करें",
        "WAIT": "कुछ दिन रुकें",
        "CONSIDER ANOTHER CROP": "दूसरी फसल पर विचार करें",
        "High": "उच्च जोखिम",
        "Medium": "मध्यम जोखिम",
        "Low": "कम जोखिम (सुरक्षित)",
        "Recommended": "अनुशंसित",
        "Not available": "उपलब्ध नहीं",
        "Sow Today": "आज ही बुवाई करें",
        "Wait 3-4 Days": "३ से ४ दिन प्रतीक्षा करें",
        "Irrigate & Sow Tomorrow": "सिंचाई करके कल बुवाई करें",
        "Change Crop": "फसल बदलें",
        "wait_reason_hi": "आज बारिश की संभावना है, लेकिन आने वाले दिनों में शुष्क मौसम रह सकता है। अंकुरण के दौरान लगातार नमी जरूरी है। ३-४ दिन रुकना आपके बीज और लागत को सुरक्षित रखेगा।",
        "sow_reason_hi": "वर्तमान मौसम और बारिश का पूर्वानुमान बुवाई के लिए अनुकूल है। अंकुरण अवधि के दौरान आवश्यक नमी बनी रहेगी।",
        "alt_reason_hi": "वर्तमान मौसमी परिस्थितियों में इस फसल की विफलता का जोखिम अधिक है। कम पानी वाली वैकल्पिक फसल चुनना बेहतर होगा।"
    }
}

def localize_explanation(explanation_en: str, verdict: str, lang: str = "en") -> str:
    """
    Returns the localized explanation if language is mr or hi, otherwise English.
    """
    if lang == "mr":
        if verdict == "WAIT":
            return TRANSLATIONS["mr"]["wait_reason_mr"]
        elif verdict == "SOW NOW":
            return TRANSLATIONS["mr"]["sow_reason_mr"]
        else:
            return TRANSLATIONS["mr"]["alt_reason_mr"]
    elif lang == "hi":
        if verdict == "WAIT":
            return TRANSLATIONS["hi"]["wait_reason_hi"]
        elif verdict == "SOW NOW":
            return TRANSLATIONS["hi"]["sow_reason_hi"]
        else:
            return TRANSLATIONS["hi"]["alt_reason_hi"]
            
    return explanation_en

async def optional_llm_enhance_explanation(
    base_explanation: str,
    verdict: str,
    crop: str,
    context: Dict[str, Any]
) -> str:
    """
    Extension Hook: If an LLM API key (e.g. ANTHROPIC_API_KEY or GEMINI_API_KEY)
    is configured in environment variables, this hook can be invoked.
    Otherwise, returns the clean rule-generated template text.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return base_explanation
        
    # Future integration: call external LLM here
    return base_explanation
