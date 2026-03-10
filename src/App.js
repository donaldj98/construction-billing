
import { useState, useRef } from "react";

const DEFAULT_COMPANY = {
  name: "Sri Balaji Constructions",
  address: "123, Main Road, Vellore, Tamil Nadu - 632001",
  phone: "+91 98765 43210",
  email: "info@sribalajiconstructions.com",
  gst: "33AABCU9603R1ZX",
  logo: "",
  taxRate: 18,
};

const DEFAULT_MATERIALS = [
  { id: 1, category: "Cement", name: "OPC 53 Grade Cement", unit: "Bag (50kg)", price: 380 },
  { id: 2, category: "Cement", name: "PPC Cement", unit: "Bag (50kg)", price: 360 },
  { id: 3, category: "Bricks", name: "Bricks - First Grade", unit: "Per 1000 Nos", price: 8500 },
  { id: 4, category: "Bricks", name: "Bricks - Second Grade", unit: "Per 1000 Nos", price: 6500 },
  { id: 5, category: "Bricks", name: "Fly Ash Bricks", unit: "Per 1000 Nos", price: 5800 },
  { id: 6, category: "Sand", name: "River Sand (M-Sand)", unit: "Cu.ft", price: 55 },
  { id: 7, category: "Sand", name: "Plastering Sand", unit: "Cu.ft", price: 48 },
  { id: 8, category: "Aggregate", name: "20mm Aggregate", unit: "Cu.ft", price: 42 },
  { id: 9, category: "Aggregate", name: "40mm Aggregate", unit: "Cu.ft", price: 38 },
  { id: 10, category: "Steel", name: "TMT Bar 8mm (Fe-500)", unit: "Kg", price: 68 },
  { id: 11, category: "Steel", name: "TMT Bar 12mm (Fe-500)", unit: "Kg", price: 65 },
  { id: 12, category: "Steel", name: "TMT Bar 16mm (Fe-500)", unit: "Kg", price: 63 },
];

const DEFAULT_LABOUR = [
  { id: 1, role: "Mason - First Class", unit: "Per Day", rate: 950 },
  { id: 2, role: "Mason - Second Class", unit: "Per Day", rate: 750 },
  { id: 3, role: "Helper / Coolie", unit: "Per Day", rate: 550 },
  { id: 4, role: "Bar Bender", unit: "Per Day", rate: 850 },
  { id: 5, role: "Carpenter", unit: "Per Day", rate: 900 },
  { id: 6, role: "Plumber", unit: "Per Day", rate: 800 },
  { id: 7, role: "Electrician", unit: "Per Day", rate: 850 },
  { id: 8, role: "Painter", unit: "Per Day", rate: 750 },
];

const generateBillNo = () => {
  const d = new Date();
  return `BILL-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000)+1000}`;
};

const todayStr = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

export default function App() {
  const [tab, setTab] = useState("bill");
  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const [materials, setMaterials] = useState(DEFAULT_MATERIALS);
  const [labour, setLabour] = useState(DEFAULT_LABOUR);
  const [client, setClient] = useState({ name: "", address: "", phone: "", project: "", billNo: generateBillNo(), date: todayStr() });
  const [billItems, setBillItems] = useState([]);
  const [labourItems, setLabourItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [editingMat, setEditingMat] = useState(null);
  const [editingLab, setEditingLab] = useState(null);
  const [newMat, setNewMat] = useState({ category: "", name: "", unit: "", price: "" });
  const [newLab, setNewLab] = useState({ role: "", unit: "Per Day", rate: "" });
  const [companyEdit, setCompanyEdit] = useState(false);
  const [companyDraft, setCompanyDraft] = useState(company);

  const addBillItem = (mat) => {
    if (billItems.find(i => i.id === mat.id)) return;
    setBillItems([...billItems, { ...mat, qty: 1 }]);
  };
  const addLabourItem = (lab) => {
    if (labourItems.find(i => i.id === lab.id)) return;
    setLabourItems([...labourItems, { ...lab, qty: 1 }]);
  };
  const updateBillQty = (id, qty) => setBillItems(billItems.map(i => i.id === id ? { ...i, qty: parseFloat(qty)||0 } : i));
  const updateLabQty = (id, qty) => setLabourItems(labourItems.map(i => i.id === id ? { ...i, qty: parseFloat(qty)||0 } : i));
  const removeBillItem = (id) => setBillItems(billItems.filter(i => i.id !== id));
  const removeLabItem = (id) => setLabourItems(labourItems.filter(i => i.id !== id));

  const matSubtotal = billItems.reduce((s, i) => s + i.price * i.qty, 0);
  const labSubtotal = labourItems.reduce((s, i) => s + i.rate * i.qty, 0);
  const subtotal = matSubtotal + labSubtotal;
  const gstAmt = subtotal * (company.taxRate / 100);
  const total = subtotal + gstAmt;

  const handlePrint = () => { window.print(); };

  const categories = [...new Set(materials.map(m => m.category))];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Barlow', sans-serif; background: #EDE8E0; min-height: 100vh; }
    .app { max-width: 900px; margin: 0 auto; padding: 16px; }
    .header { background: #1A1A1A; color: white; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
    .header-title { font-family: 'Barlow Condensed', sans-serif; font-size: 26px; font-weight: 800; letter-spacing: 1px; color: #F5A623; }
    .header-sub { font-size: 13px; color: #999; margin-top: 2px; }
    .tabs { display: flex; gap: 8px; margin-bottom: 16px; }
    .tab-btn { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.2s; background: #D4CFC6; color: #555; text-transform: uppercase; }
    .tab-btn.active { background: #C65D00; color: white; }
    .card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    .section-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; color: #1A1A1A; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-left: 4px solid #C65D00; padding-left: 10px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .field { display: flex; flex-direction: column; gap: 4px; }
    .field label { font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.4px; }
    .field input, .field select, .field textarea { padding: 9px 12px; border: 1.5px solid #E0D9D0; border-radius: 8px; font-family: 'Barlow', sans-serif; font-size: 14px; color: #1A1A1A; background: #FAFAF8; outline: none; transition: border 0.2s; }
    .field input:focus, .field select:focus { border-color: #C65D00; background: white; }
    .mat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
    .mat-chip { padding: 8px 12px; border: 1.5px solid #E0D9D0; border-radius: 8px; cursor: pointer; transition: all 0.15s; background: #FAFAF8; }
    .mat-chip:hover { border-color: #C65D00; background: #FFF5EE; }
    .mat-chip.selected { border-color: #C65D00; background: #FFF5EE; }
    .mat-chip-name { font-size: 13px; font-weight: 600; color: #1A1A1A; }
    .mat-chip-info { font-size: 11px; color: #888; margin-top: 2px; }
    .mat-chip-price { font-size: 13px; color: #C65D00; font-weight: 700; margin-top: 3px; }
    .cat-label { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; margin: 12px 0 6px; }
    .bill-table { width: 100%; border-collapse: collapse; }
    .bill-table th { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #888; padding: 8px 10px; border-bottom: 2px solid #F0EBE3; text-align: left; }
    .bill-table td { padding: 8px 10px; border-bottom: 1px solid #F5F0EA; font-size: 14px; vertical-align: middle; }
    .bill-table tr:last-child td { border-bottom: none; }
    .qty-input { width: 80px; padding: 6px 8px; border: 1.5px solid #E0D9D0; border-radius: 6px; font-size: 14px; text-align: center; font-family: 'Barlow', sans-serif; }
    .qty-input:focus { outline: none; border-color: #C65D00; }
    .remove-btn { background: none; border: none; cursor: pointer; color: #CCC; font-size: 18px; line-height: 1; padding: 2px 6px; border-radius: 4px; transition: color 0.15s; }
    .remove-btn:hover { color: #E53E3E; }
    .total-section { margin-top: 12px; padding-top: 12px; border-top: 2px solid #F0EBE3; }
    .total-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; font-size: 14px; color: #555; }
    .total-row.grand { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 800; color: #1A1A1A; padding-top: 8px; border-top: 2px solid #1A1A1A; margin-top: 4px; }
    .total-row.grand span:last-child { color: #C65D00; }
    .action-bar { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; flex-wrap: wrap; }
    .btn { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; padding: 11px 22px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.2s; text-transform: uppercase; }
    .btn-primary { background: #C65D00; color: white; }
    .btn-primary:hover { background: #A84D00; }
    .btn-outline { background: white; color: #1A1A1A; border: 2px solid #1A1A1A; }
    .btn-outline:hover { background: #1A1A1A; color: white; }
    .btn-green { background: #2D7D46; color: white; }
    .btn-green:hover { background: #245F37; }
    .empty-state { text-align: center; padding: 24px; color: #BBB; font-size: 14px; }
    .price-table { width: 100%; border-collapse: collapse; }
    .price-table th { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px; border-bottom: 2px solid #F0EBE3; text-align: left; }
    .price-table td { padding: 8px 10px; border-bottom: 1px solid #F5F0EA; font-size: 14px; }
    .price-table tr:hover td { background: #FAFAF8; }
    .edit-price-input { width: 90px; padding: 5px 8px; border: 1.5px solid #C65D00; border-radius: 6px; font-size: 14px; font-family: 'Barlow', sans-serif; text-align: right; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; background: #FFF0E5; color: #C65D00; }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100; display: flex; align-items: flex-start; justify-content: center; overflow-y: auto; padding: 20px; }
    .preview-sheet { background: white; width: 100%; max-width: 800px; border-radius: 12px; overflow: hidden; }
    .preview-actions { background: #1A1A1A; padding: 14px 20px; display: flex; gap: 10px; justify-content: flex-end; align-items: center; }
    .preview-actions span { color: #999; font-size: 13px; margin-right: auto; }
    
    /* ---- PRINT STYLES ---- */
    @media print {
      body * { visibility: hidden; }
      #print-area, #print-area * { visibility: visible; }
      #print-area { position: fixed; inset: 0; background: white; z-index: 9999; padding: 24px; }
      .no-print { display: none !important; }
    }

    /* BILL PREVIEW DESIGN */
    .bill-header { background: #1A1A1A; color: white; padding: 28px 32px; display: flex; justify-content: space-between; align-items: flex-start; }
    .bill-company-name { font-family: 'Barlow Condensed', sans-serif; font-size: 28px; font-weight: 800; color: #F5A623; letter-spacing: 1px; }
    .bill-company-details { font-size: 12px; color: #AAA; margin-top: 4px; line-height: 1.7; }
    .bill-meta { text-align: right; }
    .bill-meta .bill-no { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 700; color: #F5A623; }
    .bill-meta .bill-date { font-size: 12px; color: #AAA; margin-top: 4px; }
    .bill-body { padding: 24px 32px; }
    .bill-client-box { background: #F8F5F0; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; display: flex; gap: 40px; }
    .bill-client-field { display: flex; flex-direction: column; }
    .bill-client-label { font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
    .bill-client-value { font-size: 14px; font-weight: 600; color: #1A1A1A; margin-top: 2px; }
    .bill-items-title { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; text-transform: uppercase; color: #888; letter-spacing: 1px; margin: 16px 0 8px; padding-left: 10px; border-left: 3px solid #C65D00; }
    .bill-items-table { width: 100%; border-collapse: collapse; }
    .bill-items-table th { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #888; letter-spacing: 0.5px; padding: 8px 10px; border-bottom: 2px solid #E8E2D8; text-align: left; }
    .bill-items-table th:last-child, .bill-items-table td:last-child { text-align: right; }
    .bill-items-table th:nth-child(3), .bill-items-table td:nth-child(3) { text-align: right; }
    .bill-items-table th:nth-child(4), .bill-items-table td:nth-child(4) { text-align: right; }
    .bill-items-table td { padding: 8px 10px; border-bottom: 1px solid #F0EBE3; font-size: 13px; }
    .bill-items-table tr:last-child td { border-bottom: none; }
    .bill-totals { margin-top: 16px; padding: 16px 18px; background: #F8F5F0; border-radius: 8px; }
    .bill-total-row { display: flex; justify-content: space-between; font-size: 14px; color: #666; padding: 3px 0; }
    .bill-total-row.tax { color: #C65D00; }
    .bill-total-row.grand-total { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 800; color: #1A1A1A; margin-top: 8px; padding-top: 8px; border-top: 2px solid #1A1A1A; }
    .bill-total-row.grand-total span:last-child { color: #C65D00; }
    .bill-notes { margin-top: 16px; font-size: 12px; color: #888; padding: 10px 14px; border: 1px dashed #D4CFC6; border-radius: 6px; }
    .bill-footer { background: #1A1A1A; padding: 14px 32px; display: flex; justify-content: space-between; align-items: center; }
    .bill-footer-text { font-size: 11px; color: #666; }
    .bill-footer-gst { font-size: 11px; color: #888; }
    .bill-sign { text-align: right; }
    .bill-sign-line { width: 120px; border-top: 1px solid #555; margin: 30px 0 6px auto; }
    .bill-sign-label { font-size: 11px; color: #888; }

    .info-box { background: #FFF8F0; border: 1.5px solid #FFD9A8; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #7A4500; margin-bottom: 14px; }

    @media (max-width: 600px) {
      .grid2 { grid-template-columns: 1fr; }
      .grid3 { grid-template-columns: 1fr 1fr; }
      .mat-grid { grid-template-columns: 1fr 1fr; }
      .bill-header { flex-direction: column; gap: 12px; }
      .bill-meta { text-align: left; }
      .bill-client-box { flex-direction: column; gap: 10px; }
      .header-title { font-size: 20px; }
    }
  `;

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const BillPreview = () => (
    <div id="print-area">
      <div className="bill-header">
        <div>
          {company.logo && <img src={company.logo} alt="logo" style={{height:48, marginBottom:8, display:'block'}} />}
          <div className="bill-company-name">{company.name}</div>
          <div className="bill-company-details">
            {company.address}<br/>
            Ph: {company.phone} | {company.email}<br/>
            GSTIN: {company.gst}
          </div>
        </div>
        <div className="bill-meta">
          <div style={{fontFamily:'Barlow Condensed',fontSize:13,color:'#888',textTransform:'uppercase',letterSpacing:1}}>Tax Invoice</div>
          <div className="bill-no">{client.billNo}</div>
          <div className="bill-date">Date: {client.date}</div>
        </div>
      </div>

      <div className="bill-body">
        <div className="bill-client-box">
          <div className="bill-client-field">
            <span className="bill-client-label">Client Name</span>
            <span className="bill-client-value">{client.name || "—"}</span>
          </div>
          <div className="bill-client-field">
            <span className="bill-client-label">Site / Project</span>
            <span className="bill-client-value">{client.project || "—"}</span>
          </div>
          <div className="bill-client-field">
            <span className="bill-client-label">Address</span>
            <span className="bill-client-value">{client.address || "—"}</span>
          </div>
          <div className="bill-client-field">
            <span className="bill-client-label">Phone</span>
            <span className="bill-client-value">{client.phone || "—"}</span>
          </div>
        </div>

        {billItems.length > 0 && <>
          <div className="bill-items-title">Materials</div>
          <table className="bill-items-table">
            <thead><tr>
              <th>#</th><th>Item / Material</th><th>Unit</th><th>Qty</th><th>Rate</th><th>Amount</th>
            </tr></thead>
            <tbody>
              {billItems.map((item, i) => (
                <tr key={item.id}>
                  <td style={{color:'#AAA'}}>{i+1}</td>
                  <td><strong>{item.name}</strong><br/><span style={{fontSize:11,color:'#AAA'}}>{item.category}</span></td>
                  <td style={{textAlign:'right',color:'#888',fontSize:12}}>{item.unit}</td>
                  <td style={{textAlign:'right',fontWeight:600}}>{item.qty}</td>
                  <td style={{textAlign:'right'}}>{fmt(item.price)}</td>
                  <td style={{textAlign:'right',fontWeight:700,color:'#1A1A1A'}}>{fmt(item.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>}

        {labourItems.length > 0 && <>
          <div className="bill-items-title" style={{marginTop:20}}>Labour Charges</div>
          <table className="bill-items-table">
            <thead><tr>
              <th>#</th><th>Role</th><th>Unit</th><th>Days/Qty</th><th>Rate</th><th>Amount</th>
            </tr></thead>
            <tbody>
              {labourItems.map((item, i) => (
                <tr key={item.id}>
                  <td style={{color:'#AAA'}}>{i+1}</td>
                  <td><strong>{item.role}</strong></td>
                  <td style={{textAlign:'right',color:'#888',fontSize:12}}>{item.unit}</td>
                  <td style={{textAlign:'right',fontWeight:600}}>{item.qty}</td>
                  <td style={{textAlign:'right'}}>{fmt(item.rate)}</td>
                  <td style={{textAlign:'right',fontWeight:700,color:'#1A1A1A'}}>{fmt(item.rate * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>}

        <div className="bill-totals">
          <div className="bill-total-row"><span>Materials Subtotal</span><span>{fmt(matSubtotal)}</span></div>
          <div className="bill-total-row"><span>Labour Subtotal</span><span>{fmt(labSubtotal)}</span></div>
          <div className="bill-total-row"><span>Subtotal</span><span style={{fontWeight:600}}>{fmt(subtotal)}</span></div>
          <div className="bill-total-row tax"><span>GST @ {company.taxRate}%</span><span>{fmt(gstAmt)}</span></div>
          <div className="bill-total-row grand-total"><span>TOTAL AMOUNT</span><span>{fmt(total)}</span></div>
        </div>

        {notes && <div className="bill-notes"><strong>Notes:</strong> {notes}</div>}

        <div style={{display:'flex',justifyContent:'space-between',marginTop:28,paddingTop:20}}>
          <div style={{fontSize:12,color:'#888'}}>
            <div style={{fontWeight:700,color:'#1A1A1A',marginBottom:4}}>Payment Terms</div>
            <div>This is a computer generated bill.</div>
            <div>All disputes subject to local jurisdiction.</div>
          </div>
          <div className="bill-sign">
            <div className="bill-sign-line"></div>
            <div className="bill-sign-label">Authorized Signature</div>
            <div style={{fontSize:12,fontWeight:700,color:'#1A1A1A',marginTop:2}}>{company.name}</div>
          </div>
        </div>
      </div>

      <div className="bill-footer">
        <div className="bill-footer-text">Thank you for your business!</div>
        <div className="bill-footer-gst">GSTIN: {company.gst}</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div>
            <div className="header-title">🏗 ConstructBill Pro</div>
            <div className="header-sub">Civil Construction Billing & Quotation Tool</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:13,color:'#F5A623',fontWeight:600}}>{company.name}</div>
            <div style={{fontSize:11,color:'#666',marginTop:2}}>GST: {company.gst}</div>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab-btn ${tab==='bill'?'active':''}`} onClick={()=>setTab('bill')}>📋 Create Bill</button>
          <button className={`tab-btn ${tab==='prices'?'active':''}`} onClick={()=>setTab('prices')}>💰 Price Manager</button>
          <button className={`tab-btn ${tab==='company'?'active':''}`} onClick={()=>setTab('company')}>🏢 Company</button>
        </div>

        {/* ===== CREATE BILL TAB ===== */}
        {tab === 'bill' && <>
          {/* Client Info */}
          <div className="card">
            <div className="section-title">Client & Project Info</div>
            <div className="grid2" style={{marginBottom:10}}>
              <div className="field"><label>Client Name</label><input value={client.name} onChange={e=>setClient({...client,name:e.target.value})} placeholder="e.g. Rajesh Kumar"/></div>
              <div className="field"><label>Project / Site Name</label><input value={client.project} onChange={e=>setClient({...client,project:e.target.value})} placeholder="e.g. Residential House, Anna Nagar"/></div>
              <div className="field"><label>Phone</label><input value={client.phone} onChange={e=>setClient({...client,phone:e.target.value})} placeholder="+91 98765 43210"/></div>
              <div className="field"><label>Address</label><input value={client.address} onChange={e=>setClient({...client,address:e.target.value})} placeholder="Site address"/></div>
            </div>
            <div className="grid3">
              <div className="field"><label>Bill No.</label><input value={client.billNo} onChange={e=>setClient({...client,billNo:e.target.value})}/></div>
              <div className="field"><label>Date</label><input value={client.date} onChange={e=>setClient({...client,date:e.target.value})}/></div>
            </div>
          </div>

          {/* Material Selector */}
          <div className="card">
            <div className="section-title">Select Materials</div>
            {categories.map(cat => (
              <div key={cat}>
                <div className="cat-label">{cat}</div>
                <div className="mat-grid">
                  {materials.filter(m=>m.category===cat).map(mat => (
                    <div key={mat.id} className={`mat-chip ${billItems.find(i=>i.id===mat.id)?'selected':''}`} onClick={()=>addBillItem(mat)}>
                      <div className="mat-chip-name">{mat.name}</div>
                      <div className="mat-chip-info">{mat.unit}</div>
                      <div className="mat-chip-price">{fmt(mat.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Labour Selector */}
          <div className="card">
            <div className="section-title">Select Labour</div>
            <div className="mat-grid">
              {labour.map(lab => (
                <div key={lab.id} className={`mat-chip ${labourItems.find(i=>i.id===lab.id)?'selected':''}`} onClick={()=>addLabourItem(lab)}>
                  <div className="mat-chip-name">{lab.role}</div>
                  <div className="mat-chip-info">{lab.unit}</div>
                  <div className="mat-chip-price">{fmt(lab.rate)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="card">
            <div className="section-title">Bill Summary</div>
            {billItems.length === 0 && labourItems.length === 0
              ? <div className="empty-state">Select materials and labour above to build your bill</div>
              : <>
                {billItems.length > 0 && <>
                  <div style={{fontSize:12,fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:0.5,marginBottom:6}}>Materials</div>
                  <table className="bill-table">
                    <thead><tr>
                      <th>Item</th><th>Unit</th><th style={{textAlign:'right'}}>Rate</th><th style={{textAlign:'center'}}>Qty</th><th style={{textAlign:'right'}}>Amount</th><th></th>
                    </tr></thead>
                    <tbody>
                      {billItems.map(item => (
                        <tr key={item.id}>
                          <td><strong style={{fontSize:13}}>{item.name}</strong><br/><span style={{fontSize:11,color:'#AAA'}}>{item.category}</span></td>
                          <td style={{fontSize:12,color:'#888'}}>{item.unit}</td>
                          <td style={{textAlign:'right'}}>{fmt(item.price)}</td>
                          <td style={{textAlign:'center'}}>
                            <input type="number" className="qty-input" value={item.qty} min="0" step="0.5" onChange={e=>updateBillQty(item.id, e.target.value)}/>
                          </td>
                          <td style={{textAlign:'right',fontWeight:700,color:'#C65D00'}}>{fmt(item.price*item.qty)}</td>
                          <td><button className="remove-btn" onClick={()=>removeBillItem(item.id)}>×</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>}

                {labourItems.length > 0 && <>
                  <div style={{fontSize:12,fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:0.5,margin:'16px 0 6px'}}>Labour</div>
                  <table className="bill-table">
                    <thead><tr>
                      <th>Role</th><th>Unit</th><th style={{textAlign:'right'}}>Rate</th><th style={{textAlign:'center'}}>Days/Qty</th><th style={{textAlign:'right'}}>Amount</th><th></th>
                    </tr></thead>
                    <tbody>
                      {labourItems.map(item => (
                        <tr key={item.id}>
                          <td><strong style={{fontSize:13}}>{item.role}</strong></td>
                          <td style={{fontSize:12,color:'#888'}}>{item.unit}</td>
                          <td style={{textAlign:'right'}}>{fmt(item.rate)}</td>
                          <td style={{textAlign:'center'}}>
                            <input type="number" className="qty-input" value={item.qty} min="0" step="1" onChange={e=>updateLabQty(item.id, e.target.value)}/>
                          </td>
                          <td style={{textAlign:'right',fontWeight:700,color:'#C65D00'}}>{fmt(item.rate*item.qty)}</td>
                          <td><button className="remove-btn" onClick={()=>removeLabItem(item.id)}>×</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>}

                <div className="total-section">
                  <div className="total-row"><span>Materials Subtotal</span><span>{fmt(matSubtotal)}</span></div>
                  <div className="total-row"><span>Labour Subtotal</span><span>{fmt(labSubtotal)}</span></div>
                  <div className="total-row"><span>Subtotal</span><span style={{fontWeight:700}}>{fmt(subtotal)}</span></div>
                  <div className="total-row" style={{color:'#C65D00'}}><span>GST @ {company.taxRate}%</span><span>{fmt(gstAmt)}</span></div>
                  <div className="total-row grand"><span>GRAND TOTAL</span><span>{fmt(total)}</span></div>
                </div>
              </>
            }

            <div className="field" style={{marginTop:14}}>
              <label>Notes / Terms</label>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="e.g. Payment within 7 days. Material delivery not included." style={{padding:'9px 12px',border:'1.5px solid #E0D9D0',borderRadius:8,fontFamily:'Barlow, sans-serif',fontSize:14,resize:'vertical'}}/>
            </div>

            <div className="action-bar">
              <button className="btn btn-outline" onClick={()=>{setBillItems([]);setLabourItems([]);setClient({...client,billNo:generateBillNo(),date:todayStr()})}}>🗑 Clear Bill</button>
              <button className="btn btn-primary" onClick={()=>setShowPreview(true)} disabled={billItems.length===0&&labourItems.length===0}>👁 Preview Bill</button>
            </div>
          </div>
        </>}

        {/* ===== PRICE MANAGER TAB ===== */}
        {tab === 'prices' && <>
          <div className="card">
            <div className="info-box">💡 Update prices here any time. Changes apply to all new bills immediately. Click on a price to edit it inline.</div>
            <div className="section-title">Material Prices</div>
            <table className="price-table">
              <thead><tr><th>Category</th><th>Item</th><th>Unit</th><th style={{textAlign:'right'}}>Price (₹)</th><th></th></tr></thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m.id}>
                    <td><span className="badge">{m.category}</span></td>
                    <td style={{fontWeight:500}}>{m.name}</td>
                    <td style={{fontSize:12,color:'#888'}}>{m.unit}</td>
                    <td style={{textAlign:'right'}}>
                      {editingMat === m.id
                        ? <input className="edit-price-input" type="number" defaultValue={m.price} autoFocus
                            onBlur={e=>{setMaterials(materials.map(x=>x.id===m.id?{...x,price:parseFloat(e.target.value)||x.price}:x));setEditingMat(null);}}
                            onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}/>
                        : <span style={{cursor:'pointer',fontWeight:700,color:'#C65D00'}} onClick={()=>setEditingMat(m.id)}>{fmt(m.price)} ✏️</span>
                      }
                    </td>
                    <td><button className="remove-btn" onClick={()=>setMaterials(materials.filter(x=>x.id!==m.id))}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add new material */}
            <div style={{marginTop:16,paddingTop:14,borderTop:'2px solid #F0EBE3'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#888',textTransform:'uppercase',marginBottom:10,letterSpacing:0.5}}>Add New Material</div>
              <div className="grid3" style={{alignItems:'flex-end'}}>
                <div className="field"><label>Category</label><input value={newMat.category} onChange={e=>setNewMat({...newMat,category:e.target.value})} placeholder="e.g. Bricks"/></div>
                <div className="field"><label>Item Name</label><input value={newMat.name} onChange={e=>setNewMat({...newMat,name:e.target.value})} placeholder="e.g. Bricks - Third Grade"/></div>
                <div className="field"><label>Unit</label><input value={newMat.unit} onChange={e=>setNewMat({...newMat,unit:e.target.value})} placeholder="Per 1000 Nos"/></div>
                <div className="field"><label>Price (₹)</label><input type="number" value={newMat.price} onChange={e=>setNewMat({...newMat,price:e.target.value})} placeholder="0"/></div>
                <button className="btn btn-primary" style={{height:40}} onClick={()=>{
                  if(!newMat.name||!newMat.price) return;
                  setMaterials([...materials,{id:Date.now(),...newMat,price:parseFloat(newMat.price)}]);
                  setNewMat({category:'',name:'',unit:'',price:''});
                }}>+ Add</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-title">Labour Rates</div>
            <table className="price-table">
              <thead><tr><th>Role</th><th>Unit</th><th style={{textAlign:'right'}}>Rate (₹)</th><th></th></tr></thead>
              <tbody>
                {labour.map(l => (
                  <tr key={l.id}>
                    <td style={{fontWeight:500}}>{l.role}</td>
                    <td style={{fontSize:12,color:'#888'}}>{l.unit}</td>
                    <td style={{textAlign:'right'}}>
                      {editingLab === l.id
                        ? <input className="edit-price-input" type="number" defaultValue={l.rate} autoFocus
                            onBlur={e=>{setLabour(labour.map(x=>x.id===l.id?{...x,rate:parseFloat(e.target.value)||x.rate}:x));setEditingLab(null);}}
                            onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}/>
                        : <span style={{cursor:'pointer',fontWeight:700,color:'#C65D00'}} onClick={()=>setEditingLab(l.id)}>{fmt(l.rate)} ✏️</span>
                      }
                    </td>
                    <td><button className="remove-btn" onClick={()=>setLabour(labour.filter(x=>x.id!==l.id))}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:16,paddingTop:14,borderTop:'2px solid #F0EBE3'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#888',textTransform:'uppercase',marginBottom:10,letterSpacing:0.5}}>Add New Labour Role</div>
              <div className="grid3" style={{alignItems:'flex-end'}}>
                <div className="field"><label>Role</label><input value={newLab.role} onChange={e=>setNewLab({...newLab,role:e.target.value})} placeholder="e.g. Welder"/></div>
                <div className="field"><label>Unit</label><input value={newLab.unit} onChange={e=>setNewLab({...newLab,unit:e.target.value})} placeholder="Per Day"/></div>
                <div className="field"><label>Rate (₹)</label><input type="number" value={newLab.rate} onChange={e=>setNewLab({...newLab,rate:e.target.value})} placeholder="0"/></div>
                <button className="btn btn-primary" style={{height:40}} onClick={()=>{
                  if(!newLab.role||!newLab.rate) return;
                  setLabour([...labour,{id:Date.now(),...newLab,rate:parseFloat(newLab.rate)}]);
                  setNewLab({role:'',unit:'Per Day',rate:''});
                }}>+ Add</button>
              </div>
            </div>
          </div>
        </>}

        {/* ===== COMPANY TAB ===== */}
        {tab === 'company' && <>
          <div className="card">
            <div className="section-title">Company / Letterhead Details</div>
            {!companyEdit
              ? <>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16}}>
                    {[['Company Name',company.name],['Phone',company.phone],['Email',company.email],['Address',company.address],['GSTIN',company.gst],['GST Rate',`${company.taxRate}%`]].map(([k,v])=>(
                      <div key={k}><div style={{fontSize:11,fontWeight:700,color:'#999',textTransform:'uppercase',letterSpacing:0.4,marginBottom:2}}>{k}</div><div style={{fontSize:14,fontWeight:500}}>{v}</div></div>
                    ))}
                  </div>
                  <button className="btn btn-primary" onClick={()=>{setCompanyDraft(company);setCompanyEdit(true);}}>✏️ Edit Details</button>
                </>
              : <>
                  <div className="grid2" style={{marginBottom:12}}>
                    <div className="field"><label>Company Name</label><input value={companyDraft.name} onChange={e=>setCompanyDraft({...companyDraft,name:e.target.value})}/></div>
                    <div className="field"><label>Phone</label><input value={companyDraft.phone} onChange={e=>setCompanyDraft({...companyDraft,phone:e.target.value})}/></div>
                    <div className="field"><label>Email</label><input value={companyDraft.email} onChange={e=>setCompanyDraft({...companyDraft,email:e.target.value})}/></div>
                    <div className="field"><label>GSTIN</label><input value={companyDraft.gst} onChange={e=>setCompanyDraft({...companyDraft,gst:e.target.value})}/></div>
                    <div className="field" style={{gridColumn:'span 2'}}><label>Address</label><input value={companyDraft.address} onChange={e=>setCompanyDraft({...companyDraft,address:e.target.value})}/></div>
                    <div className="field"><label>GST Rate (%)</label><input type="number" value={companyDraft.taxRate} onChange={e=>setCompanyDraft({...companyDraft,taxRate:parseFloat(e.target.value)||0})}/></div>
                    <div className="field"><label>Logo URL (optional)</label><input value={companyDraft.logo} onChange={e=>setCompanyDraft({...companyDraft,logo:e.target.value})} placeholder="https://your-logo-url.com/logo.png"/></div>
                  </div>
                  <div style={{display:'flex',gap:10}}>
                    <button className="btn btn-primary" onClick={()=>{setCompany(companyDraft);setCompanyEdit(false);}}>✅ Save</button>
                    <button className="btn btn-outline" onClick={()=>setCompanyEdit(false)}>Cancel</button>
                  </div>
                </>
            }
          </div>
          <div className="card">
            <div className="section-title">📋 How to Update Prices Daily</div>
            <div style={{fontSize:14,color:'#555',lineHeight:1.8}}>
              <div style={{marginBottom:8}}>1. Go to the <strong>Price Manager</strong> tab</div>
              <div style={{marginBottom:8}}>2. Click any <strong style={{color:'#C65D00'}}>price (₹ amount)</strong> to edit it inline</div>
              <div style={{marginBottom:8}}>3. Type the new price and press <strong>Enter</strong> or click away</div>
              <div style={{marginBottom:8}}>4. Add new materials/grades using the <strong>Add New Material</strong> form below the table</div>
              <div style={{background:'#FFF8F0',border:'1.5px solid #FFD9A8',borderRadius:8,padding:'10px 14px',marginTop:12,fontSize:13,color:'#7A4500'}}>
                <strong>💡 Tip:</strong> Prices update instantly. All new bills you create after changing a price will automatically use the new rate.
              </div>
            </div>
          </div>
        </>}
      </div>

      {/* ===== BILL PREVIEW MODAL ===== */}
      {showPreview && (
        <div className="overlay" onClick={e=>{if(e.target.className==='overlay')setShowPreview(false)}}>
          <div className="preview-sheet">
            <div className="preview-actions no-print">
              <span>Preview your bill before printing</span>
              <button className="btn btn-green" onClick={handlePrint}>🖨 Print / Save PDF</button>
              <button className="btn btn-outline" style={{background:'transparent',color:'#CCC',border:'2px solid #555'}} onClick={()=>setShowPreview(false)}>✕ Close</button>
            </div>
            <BillPreview />
          </div>
        </div>
      )}
    </>
  );
}
