import { NAME_KEY } from "../config";
import CryptoJS from "crypto-js";

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth()).padStart(2, "0"); // Month is 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
const getItem = (path, label, key, icon, children, withAuth) => {
  if (children) {
    return { label, key, icon, children, path, withAuth };
  }
  return { label, key, icon, path, withAuth };
};

export const formatDateToMonthIST = (dateString) => {
  // Parse the ISO date string
  const date = new Date(dateString);

  // Convert to IST by adding 5 hours and 30 minutes (IST is UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // in milliseconds
  const istDate = new Date(date.getTime() + istOffset);

  // Extract components
  const month = String(istDate.getMonth() + 1).padStart(2, "0");
  const day = String(istDate.getDate()).padStart(2, "0");
  const year = String(istDate.getFullYear()).slice();

  return `${month}/${day}/${year}`;
};

/**
 * Removes the token from the session storage.
 */
export const removeSessionStorageToken = () => {
  if (sessionStorage.getItem(`${NAME_KEY}:token`)) {
    sessionStorage.setItem(`${NAME_KEY}:token`, null);
  }
};

/**
 * Sets the token in the session storage after encrypting it.
 * @param {string} token - The token to be stored in session storage.
 */
export const setSessionStorageToken = (token) => {
  sessionStorage.setItem(
    `${NAME_KEY}:token`,
    CryptoJS.AES.encrypt(token, `${NAME_KEY}-token`).toString()
  );
};
/**
 * Retrieves the token from the session storage and decrypts it.
 * @returns {string|boolean} - The decrypted token or false if not found.
 */
export const getSessionStorageToken = () => {
  const ciphertext = sessionStorage.getItem(`${NAME_KEY}:token`);
  if (ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, `${NAME_KEY}-token`);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return false;
};
/**
 * Sets the token in the local storage after encrypting it.
 * @param {string} token - Token to be stored in local storage.
 */
export const setLocalStorageToken = (token) => {
  localStorage.setItem(
    `${NAME_KEY}:token`,
    CryptoJS.AES.encrypt(token, `${NAME_KEY}-token`).toString()
  );
};
/**
 * Retrieves and decrypts the token from local storage.
 * @returns {string|boolean} - Decrypted token or false if not found.
 */
export const getLocalStorageToken = () => {
  const token = localStorage.getItem(`${NAME_KEY}:token`);
  if (token) {
    const bytes = CryptoJS.AES.decrypt(token, `${NAME_KEY}-token`);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return false;
};
/**
 * Removes the token from the local storage and navigates to a specific path if provided.
 * @param {Function} navigate - The navigate function from React Router.
 */
export const removeLocalStorageToken = (navigate) => {
  if (localStorage.getItem(`${NAME_KEY}:token`)) {
    localStorage.setItem(`${NAME_KEY}:token`, null);
  }
  if (navigate) {
    navigate("/login");
  }
};
// Set item in session storage
export const setSessionStorage = (keyName, value) => {
  try {
    sessionStorage.setItem(keyName, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to session storage:", error);
  }
};

// Get item from session storage
export const getSessionStorage = (keyName) => {
  try {
    const data = sessionStorage.getItem(keyName);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error retrieving from session storage:", error);
    return false;
  }
};

// Remove item from session storage
export const removeSessionStorage = (keyName) => {
  try {
    sessionStorage.removeItem(keyName);
  } catch (error) {
    console.error("Error removing from session storage:", error);
  }
};

export const getSideBarData = (arr) => {
  if (arr instanceof Array) {
    return arr.reduce((prev, item) => {
      if (item?.belongsToSidebar) {
        if (item.children instanceof Array) {
          const children = item.children.reduce(
            (prevElement, currentSubChild) => {
              if (currentSubChild?.belongsToSidebar) {
                prevElement.push(
                  getItem(
                    currentSubChild?.path,
                    currentSubChild?.name,
                    currentSubChild?.key,
                    currentSubChild?.icon,
                    ""
                  )
                );
              }
              return prevElement;
            },
            []
          );
          prev.push(
            getItem(item?.path, item?.name, item?.key, item?.icon, children)
          );
        } else {
          prev.push(getItem(item?.path, item?.name, item?.key, item?.icon));
        }
      }
      return prev;
    }, []);
  }
  return [];
};

export const newDateFormatter = "DD/MM/YYYY - hh:mm A";
export function decodeQueryData(data) {
  return JSON.parse(
    `{"${decodeURI(data)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace("?", "")}"}`
  );
}
export function getSortType(data) {
  return data === "ASC" ? "asc" : "desc";
}

export const navigateWithParam = (data, navigate, pathname) => {
  const searchParams = new URLSearchParams(data).toString();
  navigate(`${pathname}?${searchParams}`);
};

export const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
export const defaultHtml = `<div>
    <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="font-size: 24px; font-weight: bold; margin: 20px 0; text-align: center;">PROPOSAL FOR STUDENT COACHING SERVICES</h2>
        <p style="font-size: 16px; margin: 16px 0; text-align: center;">This Coaching Agreement is made and entered into on the <strong>[Date]</strong> day of <strong>[Month]</strong> <strong>[Year]</strong> by and between Scott Massey, PhD., PA-C, for Student Success Programs, LLC (Consultant) and <strong>[University Name]</strong> (University).</p>
    </div>

    <h3 style="font-size: 18px; font-weight: bold; margin: 20px 0;">PARTIES</h3>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div style="border: 1px solid #ddd; padding: 15px;">
            <strong>Consultant:</strong><br/>
            <span>[Consultant Name]</span><br/>
            <span>[Consultant Company Name]</span><br/>
            <span>[Consultant Address]</span><br/>
            <span>[Consultant Email]</span>
        </div>
        
        <div style="border: 1px solid #ddd; padding: 15px;">
            <strong>University:</strong><br/>
            <span>[University Contact Name]</span><br/>
            <span>[Program Director Title]</span><br/>
            <span>[University Name]</span><br/>
            <span>[University Address]</span><br/>
            <span>[University Email]</span>
        </div>
    </div>

    <h3 style="font-size: 18px; font-weight: bold; margin: 20px 0;">STUDENT COACHING SERVICES</h3>
    <p style="font-size: 16px; margin: 16px 0;"><strong>WITNESSETH now the Consultant and the University agree that the Consultant will provide the following services:</strong></p>
    
    <ol style="font-size: 15px; margin: 16px 0;">
        <li>Provide coaching to students determined to be at critical risk based on the elements of the risk modeling system. These students are provided with monthly coaching sessions. Students who are at risk of attrition may have more than one session per month depending upon the need of the student.</li>
        
        <li>Consultant has trained coaches who will provide student coaching under the supervision of Scott Massey, PhD., PA-C. <a href="https://studentsuccessprograms.com/coaching">https://studentsuccessprograms.com/coaching</a></li>
        
        <li>The students will be referred by a program representative (faculty member/program director) who will refer the students for designated coaching sessions to the Consultant. Students shall sign a waiver prior to receiving coaching from Consultant.</li>
        
        <li>A monthly call will be provided with Consultant and a faculty representative/Student Success Coach to provide ongoing updates regarding the status of each student who has received coaching.</li>
        
        <li>A monthly report will be submitted to the University representative, which describes the names of the students who received coaching, the date that services were provided, and the name of the coach who provided the services.</li>
        
        <li>A coaching report will be provided following each coaching session drafted by the coach at Scott Massey, PhD., PA-C, for Student Success Programs, LLC. This report will be provided through a secure link to the program representative.</li>
        
        <li>The Risk Scoring Data analysis is provided as part of this service at no additional charge.</li>
    </ol>

    <h3 style="font-size: 18px; font-weight: bold; margin: 20px 0;">TERMS OF THE AGREEMENT</h3>
    
    <h4 style="font-size: 16px; font-weight: bold; margin: 20px 0;">Coaching Services and Cost:</h4>
    <p style="font-size: 16px; margin: 16px 0;">The Consultant team can work with an unlimited number of students. The cost for coaching each student will be based upon the sliding scale depicted below.</p>
    
    <!-- Dynamic Pricing Section - Only one option will be shown -->
    <h5 style="font-size: 16px; font-weight: bold; margin: 20px 0;"><span>[Selected Coaching Option]</span></h5>
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
            <tr style="background: #f0f0f0;">
                <th style="border: 1px solid #ddd; padding: 8px;">Number of Students</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Price/Student/Month</th>
            </tr>
        </thead>
        <tbody id="pricingTableBody">
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">1 – 10 Students</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>[Price Tier 1]</strong></td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">11 – 20 Students</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>[Price Tier 2]</strong></td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">21 or more students</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>[Price Tier 3]</strong></td>
            </tr>
        </tbody>
    </table>

    <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0; background: #f9f9f9;">
        <h4 style="font-size: 16px; font-weight: bold; margin: 20px 0;">Contract Duration:</h4>
        <p style="font-size: 16px; margin: 16px 0;">The proposed contract will span <strong>[Duration in months]</strong> months, commencing on <strong>[Start Date]</strong>, and concluding on <strong>[End Date]</strong>. Upon the conclusion of this initial period, we can review the outcomes and consider renewing the contract if deemed necessary.</p>
    </div>

    <h4 style="font-size: 16px; font-weight: bold; margin: 20px 0;">Payment Structure:</h4>
    <p style="font-size: 16px; margin: 16px 0;">The compensation for the student coaching services, including oversight and management of the coaching program, will be based on <strong>the number of students utilizing the coaching resources</strong>. In all cases the cost will be based upon the actual number of students receiving coaching each individual month.</p>

    <div style="border: 1px solid #4caf50; padding: 15px; margin: 15px 0; background: #f1f8e9;">
        <h4 style="font-size: 16px; font-weight: bold; margin: 20px 0;">Total Cost:</h4>
        <p style="font-size: 16px; margin: 16px 0;">Considering the potential utilization of coaching resources, the total cost of the <strong>[Contract Duration]</strong>-month agreement if <strong>[Estimated Students]</strong> students are coached per month will not exceed <strong>[Calculated Maximum Cost]</strong>. This cost ceiling is flexible and directly linked to the number of students who engage in coaching during the specified period.</p>
    </div>

    <h3 style="font-size: 18px; font-weight: bold; margin: 20px 0;">INDEPENDENT CONTRACTOR</h3>
    <p style="font-size: 16px; margin: 16px 0;">Both the University and the Consultant agree that the Consultant will act as an independent contractor in the performance of its duties under this contract. Accordingly, the Consultant shall be responsible for payment of all taxes including Federal, State, and local taxes arising out of the consultant&apos;s activities in accordance with this Agreement, including by way of illustration but not limited, Federal and State income tax, Social Security tax, Unemployment Insurance taxes, and any other taxes or business license fee as required.</p>

    <h3 style="font-size: 18px; font-weight: bold; margin: 20px 0;">CONFIDENTIAL INFORMATION</h3>
    <p style="font-size: 16px; margin: 16px 0;">The Consultant agrees that any information received by the Consultant during any furtherance of the Consultant&apos;s obligations in accordance with this Agreement, which concerns the personal, financial, or other affairs of the University will be treated by the Consultant in full confidence and will not be revealed to any other persons, firms, or organizations.</p>

    <h3 style="font-size: 18px; font-weight: bold; margin: 20px 0;">FERPA COMPLIANCE</h3>
    <p style="font-size: 16px; margin: 16px 0;">The Facility acknowledges that student education records may be protected by the Family Educational Rights and Privacy Act of 1974, as amended (20 U.S.C. 1232g; 34 CFR Part 99) ("FERPA"). The Facility hereby agrees that its personnel will use such information only in furtherance of the clinical education program for the student and that the information will not be disclosed to any other party without written notice to the University and the student&apos;s prior written consent. The University agrees to provide the Facility with guidance with respect to FERPA.</p>

    <div style="border: 1px solid #ff9800; padding: 15px; margin: 15px 0; background: #fff3e0; font-style: italic;">
        <h4 style="font-size: 16px; font-weight: bold; margin: 20px 0;">DISCLAIMER OF GUARANTEE:</h4>
        <p style="font-size: 16px; margin: 16px 0;">The University understands that nothing in this contract and nothing in Consultant&apos;s statements to the University should be construed as a promise or guarantee about the success or outcome of the University&apos;s cause. Consultant will use its best efforts as experts and specialists in the field, to assist the University in its efforts towards a successful outcome.</p>
    </div>

    <div style="border: 1px solid #2196f3; padding: 15px; margin: 15px 0; background: #e3f2fd;">
        <p style="font-size: 16px; margin: 16px 0;"><strong>NOTWITHSTANDING</strong> anything else herein, both the University and Consultant each retain the right to terminate this agreement at any time upon thirty (30) days&apos; notice to the other party at their own sole discretion or to terminate the agreement immediately upon violation of any of its terms.</p>
    </div>

    <div style="margin-top: 40px; border-top: 2px solid #ccc; padding-top: 20px;">
        <p style="font-size: 16px; margin: 16px 0;"><strong>IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the day and year first above written.</strong></p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px;">
            <div>
                <p style="font-size: 16px; margin: 16px 0;"><strong>Consultant:</strong></p>
                <div style="border-bottom: 1px solid #000; height: 40px; margin: 15px 0;"></div>
                <p style="font-size: 16px; margin: 16px 0;">[Consultant Name]<br/>[Consultant Company Name]<br/>Date: <span>[Auto-Generated Date]</span></p>
            </div>
            
            <div>
                <p style="font-size: 16px; margin: 16px 0;"><strong>University:</strong></p>
                <div style="border-bottom: 1px solid #000; height: 40px; margin: 15px 0;"></div>
                <p style="font-size: 16px; margin: 16px 0;"><span>[University Name]</span><br/>Date: <span>[University Signature Date]</span></p>
            </div>
        </div>
    </div>
</div>`;
export const mapToSelectOptions = (data = [], valueKey = 'id', labelKey = 'name') => {
  return data.map(item => ({
      value: item?.[valueKey],
      label: item?.[labelKey],
  }));
};
export const removeEmptyValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => 
      value !== undefined && value !== null && value !== ''
    )
  );
};