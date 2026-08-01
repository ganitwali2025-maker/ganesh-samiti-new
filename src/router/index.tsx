import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCommitteeData } from '../hooks/useCommitteeData';

import { 
  SplashScreen, LoginScreen, MembersScreen, 
  CollectionScreen, DepositScreen, ExpenseScreen, BudgetScreen, 
  SavingsScreen, BankScreen, ReportsScreen, EventsScreen, 
  NoticeScreen, ProfileScreen, NotificationsScreen, SearchScreen, 
  SettingsScreen, MemberProfileScreen, MonthlySavingsScreen,
  ChandaDashboardScreen, ChandaEntryScreen, ChandaRegisterScreen, ChandaReportsScreen
} from '../screens';
import { Dashboard } from '../components/Dashboard';

export function AppRouter() {
  const data = useCommitteeData();
  const location = useLocation();

  // Android-style shared axis transition (slide and fade)
  const variants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore: key is required for AnimatePresence but TS complains about RoutesProps */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <SplashScreen />
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <LoginScreen />
          </motion.div>
        } />
        <Route path="/dashboard" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <Dashboard data={data} />
          </motion.div>
        } />
        <Route path="/members" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <MembersScreen />
          </motion.div>
        } />
        <Route path="/collection" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <CollectionScreen />
          </motion.div>
        } />
        <Route path="/deposit" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <DepositScreen />
          </motion.div>
        } />
        <Route path="/expense" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <ExpenseScreen />
          </motion.div>
        } />
        <Route path="/budget" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <BudgetScreen />
          </motion.div>
        } />
        <Route path="/savings" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <SavingsScreen />
          </motion.div>
        } />
        <Route path="/monthly_savings" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <MonthlySavingsScreen />
          </motion.div>
        } />
        <Route path="/bank" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <BankScreen />
          </motion.div>
        } />
        <Route path="/reports" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <ReportsScreen />
          </motion.div>
        } />
        <Route path="/events" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <EventsScreen />
          </motion.div>
        } />
        <Route path="/notice" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <NoticeScreen />
          </motion.div>
        } />
        <Route path="/profile" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <ProfileScreen />
          </motion.div>
        } />
        <Route path="/notifications" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <NotificationsScreen />
          </motion.div>
        } />
        <Route path="/search" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <SearchScreen />
          </motion.div>
        } />
        <Route path="/settings" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <SettingsScreen />
          </motion.div>
        } />
        <Route path="/member-profile/:id" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <MemberProfileScreen />
          </motion.div>
        } />
        <Route path="/chanda" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <ChandaDashboardScreen />
          </motion.div>
        } />
        <Route path="/chanda-entry" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <ChandaEntryScreen />
          </motion.div>
        } />
        <Route path="/chanda-register" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <ChandaRegisterScreen />
          </motion.div>
        } />
        <Route path="/chanda-reports" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <ChandaReportsScreen />
          </motion.div>
        } />
        <Route path="*" element={
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="w-full min-h-full">
            <Dashboard data={data} />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}
