const fs = require('fs');
const path = require('path');

const screens = [
  'SplashScreen', 'OnboardingScreen', 'LoginScreen', 
  'MembersScreen', 'CollectionScreen', 'DepositScreen', 
  'ExpenseScreen', 'BudgetScreen', 'SavingsScreen', 
  'BankScreen', 'ReportsScreen', 'EventsScreen', 
  'NoticeScreen', 'ProfileScreen', 'NotificationsScreen', 
  'SearchScreen', 'SettingsScreen'
];

const dir = path.join(__dirname, 'src', 'screens');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

screens.forEach(screen => {
  const content = `import { useNavigation } from '../context/NavigationContext';

export function ${screen}() {
  const { goBack } = useNavigation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FFF8F1] h-full p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">${screen}</h2>
      <p className="text-slate-500 mb-8">This screen is under construction.</p>
      <button 
        onClick={goBack}
        className="px-6 py-3 bg-[#FF7A00] text-white rounded-xl font-bold shadow-lg"
      >
        Go Back
      </button>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, `${screen}.tsx`), content);
});

console.log('Screens generated successfully.');
