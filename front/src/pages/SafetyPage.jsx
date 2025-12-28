import React from 'react';
import '../styles/ContentPages.css';

const SafetyPage = () => {
  const safetyTips = [
    {
      id: 1,
      title: 'בדיקה מקדימה',
      description: 'תמיד בצעו בדיקה מקדימה של הטיסן לפני הטיסה. וודאו שהסוללות טעונות, החיבורים מאובטחים ואין נזקים למבנה.',
      icon: 'bi-clipboard-check'
    },
    {
      id: 2,
      title: 'בחירת אזור טיסה',
      description: 'טוסו רק באזורים מאושרים ופתוחים, הרחק מאנשים, מבנים וקווי חשמל.',
      icon: 'bi-geo-alt'
    },
    {
      id: 3,
      title: 'מזג אוויר',
      description: 'אל תטוסו ברוח חזקה, גשם או ראות לקויה. תנאי מזג אוויר קשים מסכנים את הטיסן ואת הסביבה.',
      icon: 'bi-cloud-sun'
    },
    {
      id: 4,
      title: 'שמירה על קשר עין',
      description: 'תמיד שמרו על קשר עין עם הטיסן. אל תטוסו מעבר לטווח הראייה שלכם.',
      icon: 'bi-eye'
    },
    {
      id: 5,
      title: 'תחזוקה שוטפת',
      description: 'נקו ואחסנו את הטיסן כראוי. החלפו חלקים שחוקים ובדקו את תקינות המנועים והבקרה.',
      icon: 'bi-tools'
    },
    {
      id: 6,
      title: 'כיבוי בטוח',
      description: 'למדו כיצד לכבות את המנועים במהירות במקרה חירום. תרגלו נחיתת חירום.',
      icon: 'bi-shield-check'
    }
  ];

  const emergencyProcedures = [
    'הרחיקו אנשים מהאזור',
    'כבו מיד את המנועים',
    'הרחיקו את הטיסן ממכשולים',
    'בדקו אם יש נזקים',
    'דווחו על התקרית למועדון'
  ];

  return (
    <div className="safety-page py-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h1 className="section-title mb-4">בטיחות עם טיסנים</h1>
                <p className="lead mb-4">
                  בטיחות היא הערך החשוב ביותר בטיסנאות. הקפדה על כללי הבטיחות מבטיחה הנאה
                  מהתחביב ללא סיכון לכם או לסובבים אתכם.
                </p>

                {/* Safety Tips */}
                <div className="row mb-5">
                  {safetyTips.map(tip => (
                    <div key={tip.id} className="col-md-6 col-lg-4 mb-4">
                      <div className="card safety-tip-card card-hover h-100">
                        <div className="card-body text-center">
                          <div className="safety-icon mb-3">
                            <i className={`bi ${tip.icon} display-4 text-primary`}></i>
                          </div>
                          <h5 className="card-title">{tip.title}</h5>
                          <p className="card-text">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Emergency Procedures */}
                <div className="emergency-procedures mb-5">
                  <h3 className="mb-4">נהלי חירום</h3>
                  <div className="alert alert-danger">
                    <h5 className="alert-heading">
                      <i className="bi bi-exclamation-octagon me-2"></i>
                      מה לעשות במקרה חירום
                    </h5>
                    <ol className="mb-0">
                      {emergencyProcedures.map((procedure, index) => (
                        <li key={index} className="mb-2">{procedure}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Safety Checklist */}
                <div className="safety-checklist mb-5">
                  <h3 className="mb-4">רשימת בדיקות בטיחות</h3>
                  <div className="card">
                    <div className="card-body">
                      <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" id="check1" />
                        <label className="form-check-label" htmlFor="check1">
                          סוללות טעונות ותקינות
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" id="check2" />
                        <label className="form-check-label" htmlFor="check2">
                          כל החיבורים מאובטחים
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" id="check3" />
                        <label className="form-check-label" htmlFor="check3">
                          כנפיים וזנב מחוברים היטב
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" id="check4" />
                        <label className="form-check-label" htmlFor="check4">
                          בקרה תקינה - כל ההגאים נעים בחופשיות
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" id="check5" />
                        <label className="form-check-label" htmlFor="check5">
                          אין נזקים למבנה
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="check6" />
                        <label className="form-check-label" htmlFor="check6">
                          האזור בטוח לטיסה - ללא אנשים או מכשולים
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="alert alert-info">
                  <h5 className="alert-heading">
                    <i className="bi bi-info-circle me-2"></i>
                    זכרו
                  </h5>
                  <p className="mb-0">
                    בטיחות היא באחריותכם האישית. טיסה לא בטוחה מסכנת לא רק אתכם,
                    אלא גם את הסובבים אתכם ואת המוניטין של קהילת הטיסנאות כולה.
                    במקרה של ספק - אל תטוסו!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyPage;