// Non-failing script to log installed versions of key packages during CI installs
try {
  const fm = require('framer-motion/package.json');
  console.log('framer-motion installed:', fm.version);
} catch (e) {
  console.log('framer-motion NOT found');
}
try {
  const ri = require('react-icons/package.json');
  console.log('react-icons installed:', ri.version);
} catch (e) {
  console.log('react-icons NOT found');
}
