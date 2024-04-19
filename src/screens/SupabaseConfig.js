import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://ouucojsinltfhvrzwpnz.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dWNvanNpbmx0Zmh2cnp3cG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1MzgwNjksImV4cCI6MjAyOTExNDA2OX0.krCsDjs49hipqBrvEmsRl58ZAUBtgRapyq-8QgdkxL8';
export const supabase = createClient(supabaseUrl, supabaseKey);
