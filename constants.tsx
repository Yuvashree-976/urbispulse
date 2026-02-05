
import React from 'react';
import { 
  Building2, 
  Droplets, 
  Zap, 
  Trash2, 
  Car, 
  ShieldAlert, 
  HeartPulse, 
  Trees,
  CheckCircle2,
  Clock,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { Complaint } from './types';

export const CATEGORIES = [
  { id: 'water', name: 'Water Supply', icon: <Droplets className="w-6 h-6" />, color: 'bg-blue-500' },
  { id: 'electricity', name: 'Electricity', icon: <Zap className="w-6 h-6" />, color: 'bg-yellow-500' },
  { id: 'waste', name: 'Waste Management', icon: <Trash2 className="w-6 h-6" />, color: 'bg-green-500' },
  { id: 'roads', name: 'Roads & Traffic', icon: <Car className="w-6 h-6" />, color: 'bg-orange-500' },
  { id: 'safety', name: 'Public Safety', icon: <ShieldAlert className="w-6 h-6" />, color: 'bg-red-500' },
  { id: 'health', name: 'Public Health', icon: <HeartPulse className="w-6 h-6" />, color: 'bg-pink-500' },
  { id: 'environment', name: 'Environment', icon: <Trees className="w-6 h-6" />, color: 'bg-emerald-500' },
  { id: 'infrastructure', name: 'Infrastructure', icon: <Building2 className="w-6 h-6" />, color: 'bg-indigo-500' },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CT-9281',
    title: 'Burst Pipe on Main St',
    category: 'Water Supply',
    description: 'A major water pipe burst near the central plaza causing significant flooding.',
    status: 'In Progress',
    date: '2024-05-20',
    location: 'Central Plaza, Ward 4',
    lat: 350,
    lng: 420,
    upvotes: 45,
    isAnonymous: false,
    severity: 'High',
  },
  {
    id: 'CT-4122',
    title: 'Street Lights Not Working',
    category: 'Electricity',
    description: 'The entire block on 5th avenue is in darkness for the last 3 nights.',
    status: 'Assigned',
    date: '2024-05-18',
    location: '5th Avenue, West Side',
    lat: 480,
    lng: 610,
    upvotes: 12,
    isAnonymous: true,
    severity: 'Medium',
  },
  {
    id: 'CT-7703',
    title: 'Illegal Garbage Dumping',
    category: 'Waste Management',
    description: 'Construction debris being dumped in the public park after hours.',
    status: 'Under Review',
    date: '2024-05-21',
    location: 'Green Valley Park',
    lat: 220,
    lng: 150,
    upvotes: 89,
    isAnonymous: false,
    severity: 'Medium',
  },
  {
    id: 'CT-1100',
    title: 'Large Pothole near School',
    category: 'Roads & Traffic',
    description: 'Dangerously deep pothole right in front of the elementary school entrance.',
    status: 'Submitted',
    date: '2024-05-22',
    location: 'Westside Elementary',
    lat: 550,
    lng: 320,
    upvotes: 154,
    isAnonymous: false,
    severity: 'High',
  },
  {
    id: 'CT-2200',
    title: 'Noise Complaint: Night Construction',
    category: 'Public Safety',
    description: 'Unauthorized drilling at 2 AM near residential block B.',
    status: 'Submitted',
    date: '2024-05-22',
    location: 'Residential Block B',
    lat: 300,
    lng: 780,
    upvotes: 5,
    isAnonymous: true,
    severity: 'Low',
  }
];

export const FEATURE_HIGHLIGHTS = [
  {
    title: 'AI Smart Categorization',
    description: 'Our AI instantly routes your complaint to the correct department.',
    icon: <Zap className="text-indigo-600" />
  },
  {
    title: 'Real-time Transparency',
    description: 'Track every step of the resolution process in real-time.',
    icon: <BarChart3 className="text-indigo-600" />
  },
  {
    title: 'Community Validation',
    description: 'Upvote existing issues to show mass impact and prioritize fixes.',
    icon: <ShieldCheck className="text-indigo-600" />
  }
];
