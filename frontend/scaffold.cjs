const fs = require('fs');
const path = require('path');

const pages = [
  'public/Home', 'public/ProductDetail',
  'auth/Login', 'auth/Register',
  'user/Cart', 'user/Checkout', 'user/OrderHistory', 'user/StoreApplication',
  'store/StoreDashboard', 'store/StoreProducts', 'store/StoreOrders',
  'admin/AdminDashboard', 'admin/AdminApprovals', 'admin/AdminMonitoring'
];

pages.forEach(page => {
  const fullPath = path.join(__dirname, 'src', 'pages', page + '.tsx');
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const componentName = page.split('/')[1];
  const content = `export default function ${componentName}() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">${componentName}</h1>
    </div>
  )
}
`;
  fs.writeFileSync(fullPath, content);
});
