"use client";
import { sanitize, isValidEmail } from './security';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiMail,
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiCheck,
  FiArrowRight,
  FiCalendar,
  FiUsers,
  FiStar,
  FiAward,
  FiGlobe,
  FiLock,
  Fi Shield,
  FiEye,
  FiEyeOff,
  FiMail as FiEnvelope,
  FiPhone,
} from 'react-icons/fi';

// Type Definitions
/* Strict TypeScript + Security — no implicit any, validated inputs */
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  age: string;
  interest: 'web' | 'mobile' | 'design' | 'research' | 'ai';
  role: 'developer' | 'designer' | 'smm' | 'researcher';
  status: 'Open' | 'Urgent';
  owner: string;
  ownerInitials: string;
  ownerAvatar: string;
  postedDate: string;
  applications: number;
  tags: string[];
  requirements: string[];
  deadline: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  age: string;
  skills: string[];
  experience: string[];
  portfolio: string[];
  isAuthenticated: boolean;
}

interface FormData {
  name: string;
  email: string;
  message: string;
  subject: string;
}

// projectlink-inspired Design System
const projectlinkTheme = {
  colors: {
    primary: '#6366f1',        // projectlink blue
    secondary: '#8b5cf6',      // projectlink purple
    accent: '#06b6d4',         // projectlink cyan
    success: '#10b981',        // Success green
    warning: '#f59e0b',        // Warning orange
    error: '#ef4444',          // Error red
    background: '#0f172a',      // Dark background
    surface: '#1e293b',        // Surface color
    card: '#1e293b',           // Card background
    textPrimary: '#f1f5f9',     // Primary text
    textSecondary: '#94a3b8',   // Secondary text
    textMuted: '#64748b',      // Muted text
    border: '#334155',         // Border color
    hover: '#334155',          // Hover state
    greekPattern: 'rgba(99, 102, 241, 0.1)', // Greek-inspired pattern
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '50%',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.3)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.4)',
    hero: '0 20px 40px rgba(99, 102, 241, 0.3)',
  },
};

// Greek-inspired Pattern Component
const GreekPattern = styled.div`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, ${projectlinkTheme.colors.greekPattern} 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, ${projectlinkTheme.colors.greekPattern} 0%, transparent 50%);
    z-index: 0;
    pointer-events: none;
  }
`;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${projectlinkTheme.spacing.md};
  position: relative;
  z-index: 1;
`;

const Header = styled.header<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.scrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent'};
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: ${projectlinkTheme.spacing.md} 0;
  transition: all 0.3s ease;
  border-bottom: ${props => props.scrolled ? `1px solid ${projectlinkTheme.colors.border}` : '1px solid transparent'};
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${projectlinkTheme.spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${projectlinkTheme.spacing.md};
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${projectlinkTheme.colors.surface};
    padding: ${projectlinkTheme.spacing.lg};
    border-radius: ${projectlinkTheme.borderRadius.lg};
    border: 1px solid ${projectlinkTheme.colors.border};
    box-shadow: ${projectlinkTheme.shadows.lg};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${projectlinkTheme.spacing.sm};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${projectlinkTheme.colors.textPrimary};
  cursor: pointer;
  position: relative;
  z-index: 1001;
  
  & span {
    background: linear-gradient(135deg, ${projectlinkTheme.colors.primary}, ${projectlinkTheme.colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${projectlinkTheme.spacing.lg};
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const NavLink = styled.a<{ active: boolean }>`
  color: ${props => props.active ? projectlinkTheme.colors.primary : projectlinkTheme.colors.textSecondary};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: ${projectlinkTheme.spacing.sm} ${projectlinkTheme.spacing.md};
  border-radius: ${projectlinkTheme.borderRadius.md};
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: ${projectlinkTheme.colors.primary};
    background: ${projectlinkTheme.colors.hover};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${projectlinkTheme.colors.primary}, ${projectlinkTheme.colors.accent});
    transform: ${props => props.active ? 'scaleX(1)' : 'scaleX(0)'};
    transition: transform 0.3s ease;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${projectlinkTheme.spacing.sm};
  align-items: center;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${projectlinkTheme.colors.textPrimary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${projectlinkTheme.spacing.sm};
  border-radius: ${projectlinkTheme.borderRadius.md};
  transition: background 0.3s ease;
  
  &:hover {
    background: ${projectlinkTheme.colors.hover};
  }
  
  @media (max-width: 768px) {
    display: block;
    position: relative;
    z-index: 1001;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline'; size?: 'sm' | 'md' | 'lg'; }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${projectlinkTheme.spacing.sm};
  padding: ${props => {
    sm: `${projectlinkTheme.spacing.sm} ${projectlinkTheme.spacing.md}`,
    md: `${projectlinkTheme.spacing.md} ${projectlinkTheme.spacing.lg}`,
    lg: `${projectlinkTheme.spacing.md} ${projectlinkTheme.spacing.xl}`,
  }[props.size || 'md']};
  border: none;
  border-radius: ${projectlinkTheme.borderRadius.md};
  font-size: ${props => {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
  }[props.size || 'md']};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, ${projectlinkTheme.colors.primary}, ${projectlinkTheme.colors.secondary});
    color: white;
    box-shadow: ${projectlinkTheme.shadows.md};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${projectlinkTheme.shadows.lg};
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: ${projectlinkTheme.colors.surface};
    color: ${projectlinkTheme.colors.textPrimary};
    border: 1px solid ${projectlinkTheme.colors.border};
    
    &:hover {
      background: ${projectlinkTheme.colors.hover};
      border-color: ${projectlinkTheme.colors.primary};
      color: ${projectlinkTheme.colors.primary};
    }
  `}
  
  ${props => props.variant === 'outline' && `
    background: transparent;
    color: ${projectlinkTheme.colors.primary};
    border: 2px solid ${projectlinkTheme.colors.primary};
    
    &:hover {
      background: ${projectlinkTheme.colors.primary};
      color: white;
      transform: translateY(-2px);
    }
  `}
`;

const HeroSection = styled.section`
  padding: 120px 0 80px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, ${projectlinkTheme.colors.background}, ${projectlinkTheme.colors.surface});
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, ${projectlinkTheme.colors.primary}20 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, ${projectlinkTheme.colors.secondary}20 0%, transparent 50%);
    z-index: 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: ${projectlinkTheme.spacing.lg};
  background: linear-gradient(135deg, ${projectlinkTheme.colors.textPrimary}, ${projectlinkTheme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${projectlinkTheme.colors.textSecondary};
  margin-bottom: ${projectlinkTheme.spacing.xl};
  line-height: 1.7;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${projectlinkTheme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${projectlinkTheme.spacing.xl};
`;

const HeroCard = styled.div`
  background: ${projectlinkTheme.colors.surface};
  border: 1px solid ${projectlinkTheme.colors.border};
  border-radius: ${projectlinkTheme.borderRadius.xl};
  padding: ${projectlinkTheme.spacing.xl};
  box-shadow: ${projectlinkTheme.shadows.xl};
  backdrop-filter: blur(10px);
  max-width: 500px;
  margin: ${projectlinkTheme.spacing.xl} auto 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${projectlinkTheme.colors.primary}, ${projectlinkTheme.colors.accent});
    border-radius: ${projectlinkTheme.borderRadius.xl} ${projectlinkTheme.borderRadius.xl} 0 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${projectlinkTheme.spacing.lg};
  margin-top: ${projectlinkTheme.spacing.xl};
`;

const StatCard = styled.div`
  text-align: center;
  padding: ${projectlinkTheme.spacing.lg};
  background: ${projectlinkTheme.colors.background};
  border-radius: ${projectlinkTheme.borderRadius.lg};
  border: 1px solid ${projectlinkTheme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${projectlinkTheme.colors.primary};
    box-shadow: ${projectlinkTheme.shadows.md};
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${projectlinkTheme.colors.primary};
  margin-bottom: ${projectlinkTheme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${projectlinkTheme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Section = styled.section`
  padding: ${projectlinkTheme.spacing.xxl} 0;
  position: relative;
  background: ${props => props.alt ? projectlinkTheme.colors.surface : projectlinkTheme.colors.background};
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  text-align: center;
  margin-bottom: ${projectlinkTheme.spacing.md};
  background: linear-gradient(135deg, ${projectlinkTheme.colors.textPrimary}, ${projectlinkTheme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.125rem;
  color: ${projectlinkTheme.colors.textSecondary};
  margin-bottom: ${projectlinkTheme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${projectlinkTheme.spacing.xl};
  margin-top: ${projectlinkTheme.spacing.xl};
`;

const ProjectCard = styled(motion.div)`
  background: ${projectlinkTheme.colors.surface};
  border: 1px solid ${projectlinkTheme.colors.border};
  border-radius: ${projectlinkTheme.borderRadius.xl};
  overflow: hidden;
  transition: all 0.4s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${projectlinkTheme.shadows.xl};
    border-color: ${projectlinkTheme.colors.primary};
  }
`;

const ProjectImage = styled.div<{ image: string }>`
  height: 200px;
  background: ${props => props.image};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.3));
    z-index: 1;
  }
`;

const ProjectBadge = styled.span<{ status: string }>`
  position: absolute;
  top: ${projectlinkTheme.spacing.md};
  right: ${projectlinkTheme.spacing.md};
  padding: ${projectlinkTheme.spacing.xs} ${projectlinkTheme.spacing.md};
  background: ${props => {
    switch (props.status) {
      case 'Urgent': return projectlinkTheme.colors.warning;
      case 'Open': return projectlinkTheme.colors.success;
      default: return projectlinkTheme.colors.primary;
    }
  }};
  color: white;
  border-radius: ${projectlinkTheme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
`;

const ProjectContent = styled.div`
  padding: ${projectlinkTheme.spacing.xl};
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: ${projectlinkTheme.spacing.sm};
  color: ${projectlinkTheme.colors.textPrimary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectDescription = styled.p`
  color: ${projectlinkTheme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: ${projectlinkTheme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: ${projectlinkTheme.spacing.md};
  margin-bottom: ${projectlinkTheme.spacing.md};
  flex-wrap: wrap;
`;

const ProjectMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${projectlinkTheme.spacing.xs};
  color: ${projectlinkTheme.colors.textMuted};
  font-size: 0.75rem;
`;

const ProjectTags = styled.div`
  display: flex;
  gap: ${projectlinkTheme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${projectlinkTheme.spacing.md};
`;

const ProjectTag = styled.span`
  padding: ${projectlinkTheme.spacing.xs} ${projectlinkTheme.spacing.sm};
  background: ${projectlinkTheme.colors.background};
  border: 1px solid ${projectlinkTheme.colors.border};
  border-radius: ${projectlinkTheme.borderRadius.full};
  font-size: 0.625rem;
  color: ${projectlinkTheme.colors.textSecondary};
  font-weight: 500;
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${projectlinkTheme.spacing.md};
  border-top: 1px solid ${projectlinkTheme.colors.border};
`;

const ProjectOwner = styled.div`
  display: flex;
  align-items: center;
  gap: ${projectlinkTheme.spacing.sm};
`;

const ProjectOwnerAvatar = styled.div<{ avatar: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${projectlinkTheme.borderRadius.full};
  background: ${props => props.avatar};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const ProjectOwnerInfo = styled.div`
  h4 {
    font-size: 0.875rem;
    margin-bottom: ${projectlinkTheme.spacing.xs / 2};
    color: ${projectlinkTheme.colors.textPrimary};
  }
  
  p {
    font-size: 0.75rem;
    color: ${projectlinkTheme.colors.textMuted};
    margin: 0;
  }
`;

const ApplyButton = styled.button`
  padding: ${projectlinkTheme.spacing.sm} ${projectlinkTheme.spacing.md};
  background: linear-gradient(135deg, ${projectlinkTheme.colors.primary}, ${projectlinkTheme.colors.secondary});
  color: white;
  border: none;
  border-radius: ${projectlinkTheme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${projectlinkTheme.spacing.xs};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${projectlinkTheme.shadows.md};
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${projectlinkTheme.spacing.xl};
  margin-top: ${projectlinkTheme.spacing.xl};
`;

const StepCard = styled.div`
  background: ${projectlinkTheme.colors.surface};
  border: 1px solid ${projectlinkTheme.colors.border};
  border-radius: ${projectlinkTheme.borderRadius.xl};
  padding: ${projectlinkTheme.spacing.xl};
  text-align: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${projectlinkTheme.shadows.lg};
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${projectlinkTheme.colors.primary}, ${projectlinkTheme.colors.secondary});
  color: white;
  border-radius: ${projectlinkTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto ${projectlinkTheme.spacing.md};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    background: linear-gradient(135deg, ${projectlinkTheme.colors.primary}, ${projectlinkTheme.colors.accent});
    border-radius: ${projectlinkTheme.borderRadius.full};
    z-index: -1;
    opacity: 0.3;
  }
`;

const StepIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${projectlinkTheme.colors.background};
  border-radius: ${projectlinkTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${projectlinkTheme.colors.primary};
  margin: ${projectlinkTheme.spacing.md} auto;
  border: 2px solid ${projectlinkTheme.colors.border};
  transition: all 0.3s ease;
  
  ${StepCard}:hover & {
    transform: scale(1.1);
    border-color: ${projectlinkTheme.colors.primary};
    box-shadow: ${projectlinkTheme.shadows.md};
  }
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: ${projectlinkTheme.spacing.sm};
  color: ${projectlinkTheme.colors.textPrimary};
`;

const StepDescription = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${projectlinkTheme.colors.textSecondary};
`;

const AboutSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${projectlinkTheme.spacing.xxl};
  align-items: center;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const AboutContent = styled.div``;

const AboutTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: ${projectlinkTheme.spacing.lg};
  background: linear-gradient(135deg, ${projectlinkTheme.colors.textPrimary}, ${projectlinkTheme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AboutText = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: ${projectlinkTheme.spacing.xl};
  color: ${projectlinkTheme.colors.textSecondary};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${projectlinkTheme.spacing.md};
  margin-bottom: ${projectlinkTheme.spacing.xl};
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${projectlinkTheme.spacing.sm};
  padding: ${projectlinkTheme.spacing.md};
  background: ${projectlinkTheme.colors.background};
  border-radius: ${projectlinkTheme.borderRadius.md};
  border: 1px solid ${projectlinkTheme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${projectlinkTheme.colors.primary};
    box-shadow: ${projectlinkTheme.shadows.md};
  }
  
  svg {
    color: ${projectlinkTheme.colors.success};
    font-size: 1.25rem;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${projectlinkTheme.spacing.lg};
  margin-top: ${projectlinkTheme.spacing.xl};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${projectlinkTheme.spacing.lg};
  background: linear-gradient(135deg, ${projectlinkTheme.colors.surface}, ${projectlinkTheme.colors.background});
  border-radius: ${projectlinkTheme.borderRadius.xl};
  border: 1px solid ${projectlinkTheme.colors.border};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${projectlinkTheme.shadows.lg};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${projectlinkTheme.colors.accent}, ${projectlinkTheme.colors.primary});
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: scaleY(1);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${projectlinkTheme.colors.accent};
  margin-bottom: ${projectlinkTheme.spacing.sm};
`;

const StatDescription = styled.div`
  font-size: 0.875rem;
  color: ${projectlinkTheme.colors.textSecondary};
`;

const AboutImage = styled.div`
  text-align: center;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: ${projectlinkTheme.borderRadius.xl};
    box-shadow: ${projectlinkTheme.shadows.xl};
    border: 1px solid ${projectlinkTheme.colors.border};
  }
`;

const ContactSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${projectlinkTheme.spacing.xxl};
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${projectlinkTheme.spacing.lg};
  background: ${projectlinkTheme.colors.surface};
  border: 1px solid ${projectlinkTheme.colors.border};
  border-radius: ${projectlinkTheme.borderRadius.xl};
  padding: ${projectlinkTheme.spacing.xl};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${projectlinkTheme.spacing.sm};
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${projectlinkTheme.colors.textPrimary};
`;

const FormInput = styled.input`
  padding: ${projectlinkTheme.spacing.md};
  background: ${projectlinkTheme.colors.background};
  border: 1px solid ${projectlinkTheme.colors.border};
  border-radius: ${projectlinkTheme.borderRadius.md};
  color: ${projectlinkTheme.colors.textPrimary};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${projectlinkTheme.colors.primary};
    box-shadow: 0 0 0 3px ${projectlinkTheme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${projectlinkTheme.colors.textMuted};
  }
`;

const FormTextarea = styled.textarea`
  padding: ${projectlinkTheme.spacing.md};
  background: ${projectlinkTheme.colors.background};
  border: 1px solid ${projectlinkTheme.colors.border};
  border-radius: ${projectlinkTheme.borderRadius.md};
  color: ${projectlinkTheme.colors.textPrimary};
  font-size: 1rem};
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${projectlinkTheme.colors.primary};
    box-shadow: 0 0 0 3px ${projectlinkTheme.colors.primary}20;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${projectlinkTheme.spacing.lg};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${projectlinkTheme.spacing.md};
  padding: ${projectlinkTheme.spacing.lg};
  background: ${projectlinkTheme.colors.surface};
  border-radius: ${projectlinkTheme.borderRadius.lg};
  border: 1px solid ${projectlinkTheme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(8px);
    border-color: ${projectlinkTheme.colors.primary};
  }
`;

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${projectlinkTheme.colors.background};
  border-radius: ${projectlinkTheme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${projectlinkTheme.colors.primary};
  flex-shrink: 0;
`;

const ContactText = styled.div`
  h3 {
    font-size: 1.125rem;
    margin-bottom: ${projectlinkTheme.spacing.xs};
    color: ${projectlinkTheme.colors.textPrimary};
  }
  
  p {
    color: ${projectlinkTheme.colors.textSecondary};
    margin: 0;
    font-size: 1rem;
  }
`;

const Footer = styled.footer`
  background: ${projectlinkTheme.colors.surface};
  border-top: 1px solid ${projectlinkTheme.colors.border};
  padding: ${projectlinkTheme.spacing.xxl} 0 ${projectlinkTheme.spacing.lg};
  margin-top: ${projectlinkTheme.spacing.xxl};
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: ${projectlinkTheme.spacing.xl};
  margin-bottom: ${projectlinkTheme.spacing.xl};
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterBrand = styled.div``;

const FooterLinks = styled.div``;

const FooterTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: ${projectlinkTheme.spacing.md};
  color: ${projectlinkTheme.colors.textPrimary};
`;

const FooterLinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: ${projectlinkTheme.spacing.sm};
  
  a {
    color: ${projectlinkTheme.colors.textSecondary};
    text-decoration: none;
    font-size: 0.875rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: ${projectlinkTheme.spacing.xs};
    
    &:hover {
      color: ${projectlinkTheme.colors.primary};
      transform: translateX(4px);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: ${projectlinkTheme.spacing.lg};
  border-top: 1px solid ${projectlinkTheme.colors.border};
  color: ${projectlinkTheme.colors.textMuted};
  font-size: 0.875rem;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: ${projectlinkTheme.spacing.md};
  backdrop-filter: blur(10px);
`;

const ModalContent = styled(motion.div)`
  background: ${projectlinkTheme.colors.surface};
  border: 1px solid ${projectlinkTheme.colors.border};
  border-radius: ${projectlinkTheme.borderRadius.xl};
  padding: ${projectlinkTheme.spacing.xl};
  max-width: 500px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalClose = styled.button`
  position: absolute;
  top: ${projectlinkTheme.spacing.md};
  right: ${projectlinkTheme.spacing.md};
  background: none;
  border: none;
  color: ${projectlinkTheme.colors.textMuted};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${projectlinkTheme.spacing.sm};
  border-radius: ${projectlinkTheme.borderRadius.md};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${projectlinkTheme.colors.background};
    color: ${projectlinkTheme.colors.error};
  }
`;

const Toast = styled(motion.div)<{ type: 'success' | 'error' | 'warning' }>`
  position: fixed;
  bottom: ${projectlinkTheme.spacing.lg};
  right: ${projectlinkTheme.spacing.lg};
  background: ${props => {
    switch (props.type) {
      case 'success': return projectlinkTheme.colors.success;
      case 'error': return projectlinkTheme.colors.error;
      case 'warning': return projectlinkTheme.colors.warning;
      default: return projectlinkTheme.colors.primary;
    }
  }};
  color: white;
  padding: ${projectlinkTheme.spacing.md} ${projectlinkTheme.spacing.lg};
  border-radius: ${projectlinkTheme.borderRadius.lg};
  box-shadow: ${projectlinkTheme.shadows.xl};
  z-index: 3000;
  display: flex;
  align-items: center;
  gap: ${projectlinkTheme.spacing.sm};
  max-width: 400px;
`;

const ErrorMessage = styled.div`
  color: ${projectlinkTheme.colors.error};
  font-size: 0.75rem;
  margin-top: ${projectlinkTheme.spacing.xs};
`;

// Components
const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'warning' }>>([]);
  
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };
  
  return (
    <>
      {children}
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <FiCheck /> {toast.message}
          </Toast>
        ))}
      </AnimatePresence>
    </>
  );
};

// Form validation schemas
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerFormSchema = loginFormSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// API mock functions
const mockApi = {
  async submitContactForm(data: FormData): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Message sent successfully!' };
  },
  
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password) {
      return { 
        success: true, 
        user: {
          id: 1,
          name: email.split('@')[0],
          email,
          age: '18+',
          skills: ['React', 'TypeScript', 'Node.js'],
          experience: ['Web Development', 'Mobile Apps'],
          portfolio: ['project1', 'project2'],
          isAuthenticated: true,
        },
        message: 'Login successful!' 
      };
    }
    return { success: false, message: 'Invalid credentials' };
  },
  
  async register(userData: any): Promise<{ success: boolean; user?: User; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (userData.email && userData.password && userData.name) {
      return { 
        success: true, 
        user: {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          age: '18+',
          skills: ['React', 'TypeScript', 'Node.js'],
          experience: ['Web Development', 'Mobile Apps'],
          portfolio: [],
          isAuthenticated: true,
        },
        message: 'Registration successful!' 
      };
    }
    return { success: false, message: 'Registration failed' };
  },
};

// Main App Component
const ProjectLinkApp: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
  });
  
  const loginForm = useForm<{ email: string; password: string }>({ resolver: zodResolver(loginFormSchema) });
  const registerForm = useForm<{ name: string; email: string; password: string; confirmPassword: string }>({ resolver: zodResolver(registerFormSchema) });
  
  // Project data (simulating real API call)
  const sampleProjects: Project[] = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Modern e-commerce platform with React and Node.js, featuring real-time inventory management and payment integration.',
      image: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      age: '17-19',
      interest: 'web',
      role: 'developer',
      status: 'Open',
      owner: 'Alex Johnson',
      ownerInitials: 'AJ',
      ownerAvatar: 'linear-gradient(135deg, #06b6d4, #10b981)',
      postedDate: '2024-01-15',
      applications: 12,
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      requirements: ['React', 'Node.js', 'MongoDB', 'REST API'],
      deadline: '2024-02-15',
    },
    {
      id: 2,
      title: 'Mobile Fitness Tracker',
      description: 'Cross-platform fitness tracking app with goal setting, workout logging, and social features for health motivation.',
      image: 'linear-gradient(135deg, #10b981, #06b6d4)',
      age: '15-17',
      interest: 'mobile',
      role: 'designer',
      status: 'Urgent',
      owner: 'Sarah Chen',
      ownerInitials: 'SC',
      ownerAvatar: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      postedDate: '2024-01-20',
      applications: 5,
      tags: ['React Native', 'Expo', 'Firebase', 'UI Design'],
      requirements: ['React Native', 'UI/UX Design', 'Firebase'],
      deadline: '2024-01-30',
    },
    {
      id: 3,
      title: 'AI Language Learning App',
      description: 'Intelligent language learning platform using ML to personalize lessons based on user\'s learning style and progress.',
      image: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      age: '16-18',
      interest: 'ai',
      role: 'developer',
      status: 'Open',
      owner: 'Mike Rodriguez',
      ownerInitials: 'MR',
      ownerAvatar: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      postedDate: '2024-01-25',
      applications: 18,
      tags: ['Python', 'TensorFlow', 'Flutter', 'NLP'],
      requirements: ['Python', 'Machine Learning', 'Flutter'],
      deadline: '2024-02-20',
    },
    {
      id: 4,
      title: 'Portfolio Website Builder',
      description: 'Drag-and-drop website builder for creating professional portfolios without coding, featuring templates and customization.',
      image: 'linear-gradient(135deg, #f59e0b, #84cc16)',
      age: '18+',
      interest: 'web',
      role: 'designer',
      status: 'Open',
      owner: 'Emily Davis',
      ownerInitials: 'ED',
      ownerAvatar: 'linear-gradient(135deg, #ef4444, #f59e0b)',
      postedDate: '2024-02-01',
      applications: 8,
      tags: ['Vue.js', 'Tailwind CSS', 'Firebase', 'UI/UX'],
      requirements: ['Vue.js', 'CSS Framework', 'Backend Integration'],
      deadline: '2024-03-15',
    },
    {
      id: 5,
      title: 'Scientific Data Analyzer',
      description: 'Desktop application for scientific data analysis and visualization with multiple chart types and export capabilities.',
      image: 'linear-gradient(135deg, #84cc16, #22c55e)',
      age: '17-19',
      interest: 'research',
      role: 'researcher',
      status: 'Open',
      owner: 'Dr. James Wilson',
      ownerInitials: 'JW',
      ownerAvatar: 'linear-gradient(135deg, #64748b, #475569)',
      postedDate: '2024-02-05',
      applications: 3,
      tags: ['Python', 'Matplotlib', 'Tkinter', 'Data Science'],
      requirements: ['Python', 'Data Analysis', 'Visualization'],
      deadline: '2024-03-01',
    },
    {
      id: 6,
      title: 'Smart Home Automation',
      description: 'IoT-based home automation system controlling lights, temperature, security cameras, and appliances via mobile app.',
      image: 'linear-gradient(135deg, #22c55e, #14b8a6)',
      age: '16-18',
      interest: 'mobile',
      role: 'developer',
      status: 'Open',
      owner: 'Lisa Anderson',
      ownerInitials: 'LA',
      ownerAvatar: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      postedDate: '2024-02-10',
      applications: 15,
      tags: ['Arduino', 'IoT', 'Bluetooth', 'React Native'],
      requirements: ['IoT', 'Embedded Systems', 'Mobile Development'],
      deadline: '2024-02-28',
    },
  ];
  
  useEffect(() => {
    setProjects(sampleProjects);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleScrollSpy = () => {
      const sections = ['home', 'projects', 'how-it-works', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollSpy);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollSpy);
    };
  }, []);
  
  const filteredProjects = useCallback(() => {
    return projects.filter(project => {
      const matchesAge = !selectedAge || project.age === selectedAge;
      const matchesInterest = !selectedInterest || project.interest === selectedInterest;
      const matchesRole = !selectedRole || project.role === selectedRole;
      
      return matchesAge && matchesInterest && matchesRole;
    });
  }, [projects, selectedAge, selectedInterest, selectedRole]);
  
  const handleAgeChange = (value: string) => {
    setSelectedAge(value);
  };
  
  const handleInterestChange = (value: string) => {
    setSelectedInterest(value);
  };
  
  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };
  
  const handleApplyFilters = () => {
    // Toast notification handled via context
  };
  
  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const result = await mockApi.login(data.email, data.password);
      if (result.success && result.user) {
        setUser(result.user);
        setIsLoginModalOpen(false);
        loginForm.reset();
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Login failed. Please try again.', 'error');
    }
  };
  
  const handleRegister = async (data: any) => {
    try {
      const result = await mockApi.register(data);
      if (result.success && result.user) {
        setUser(result.user);
        setIsRegisterModalOpen(false);
        registerForm.reset();
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Registration failed. Please try again.', 'error');
    }
  };
  
  const handleContactSubmit = async (data: FormData) => {
    try {
      const result = await mockApi.submitContactForm(data);
      if (result.success) {
        reset();
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Failed to send message. Please try again.', 'error');
    }
  };
  
  const handleProjectApply = (projectId: number) => {
    if (!user) {
      setIsLoginModalOpen(true);
      showToast('Please login or register to apply to this project', 'warning');
      return;
    }
    showToast('Application submitted successfully!', 'success');
  };
  
  const handleLogout = () => {
    setUser(null);
    showToast('Logged out successfully', 'success');
  };
  
  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };
  
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    // This will be handled by ToastContainer
    console.log(`Toast: ${message} (${type})`);
  };
  
  return (
    <ToastContainer>
      <GreekPattern>
        <Header scrolled={scrolled}>
          <Nav isOpen={mobileMenuOpen}>
            <Logo>
              <FiBriefcase />
              <span>Project<span style={{ color: projectlinkTheme.colors.accent }}>Link</span></span>
            </Logo>
            
            <NavLinks>
              <NavLink 
                active={activeSection === 'home'} 
                onClick={() => scrollToSection('home')}
              >
                Bosh sahifa
              </NavLink>
              <NavLink 
                active={activeSection === 'projects'} 
                onClick={() => scrollToSection('projects')}
              >
                Loyihalar
              </NavLink>
              <NavLink 
                active={activeSection === 'how-it-works'} 
                onClick={() => scrollToSection('how-it-works')}
              >
                Qanday ishlaydi
              </NavLink>
              <NavLink 
                active={activeSection === 'about'} 
                onClick={() => scrollToSection('about')}
              >
                Haqida
              </NavLink>
              <NavLink 
                active={activeSection === 'contact'} 
                onClick={() => scrollToSection('contact')}
              >
                Bog‘lobo‘lyish
              </NavLink>
            </NavLinks>
            
            <HeaderActions>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: projectlinkTheme.spacing.md }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: projectlinkTheme.spacing.sm,
                    padding: projectlinkTheme.spacing.sm,
                    background: projectlinkTheme.colors.surface,
                    borderRadius: projectlinkTheme.borderRadius.md,
                    border: `1px solid ${projectlinkTheme.colors.border}`
                  }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: projectlinkTheme.borderRadius.full,
                      background: projectlinkTheme.colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: projectlinkTheme.colors.textPrimary, fontSize: '0.875rem' }}>{user.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Chiqish
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Kirish
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => {
                      setIsRegisterModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Ro‘yxatdan o‘tish
                  </Button>
                </>
              )}
            </HeaderActions>
            
            <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </MobileMenuButton>
          </Nav>
        </Header>

        <main>
          {/* Hero Section */}
          <HeroSection id="home">
            <Container>
              <HeroContent>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <HeroTitle>
                    O‘zbekistondagi o‘quvchilar uchun mahalliy loyihalar topish va jamoalarga qo‘shilish platformasi
                  </HeroTitle>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <HeroSubtitle>
                    ProjectLink - O‘zbekistondagi talabalar va yoshlar o‘z ko‘nikmalarini sinovdan o‘tashu va real loyihalarda amaliy tajriba olish uchun loyihalar topish platformasi
                  </HeroSubtitle>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <HeroButtons>
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={() => scrollToSection('projects')}
                    >
                      Loyihalarni ko‘rish <FiArrowRight />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={() => scrollToSection('how-it-works')}
                    >
                      Ko‘proq bilish
                    </Button>
                  </HeroButtons>
                </motion.div>
              </HeroContent>
              
              <HeroCard>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    marginBottom: projectlinkTheme.spacing.lg,
                    color: projectlinkTheme.colors.textPrimary
                  }}>
                    Platform Statistika
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: projectlinkTheme.spacing.md
                  }}>
                    <div>
                      <StatNumber>250+</StatNumber>
                      <StatLabel>Mavjud loyihalar</StatLabel>
                    </div>
                    <div>
                      <StatNumber>1,200+</StatNumber>
                      <StatLabel>Jamoa a’zolari</StatLabel>
                    </div>
                    <div>
                      <StatNumber>85%</StatNumber>
                      <StatLabel>Muvaffaqiyat darajasi</StatLabel>
                    </div>
                  </div>
                </div>
              </HeroCard>
            </Container>
          </HeroSection>

          {/* Projects Section */}
          <Section id="projects">
            <Container>
              <SectionTitle>Loyihalar</SectionTitle>
              <SectionSubtitle>
                Siz qiziqishingiz va ko‘nikmalaringizga mos keladigan loyihalarni ko‘ring
              </SectionSubtitle>
              
              <div style={{ 
                display: 'flex', 
                gap: projectlinkTheme.spacing.md, 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                marginBottom: projectlinkTheme.spacing.xl,
                padding: projectlinkTheme.spacing.lg,
                background: projectlinkTheme.colors.surface,
                borderRadius: projectlinkTheme.borderRadius.lg,
                border: `1px solid ${projectlinkTheme.colors.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: projectlinkTheme.spacing.sm }}>
                  <FiUser size={20} style={{ color: projectlinkTheme.colors.textSecondary }} />
                  <select 
                    value={selectedAge} 
                    onChange={(e) => handleAgeChange(e.target.value)}
                    style={{ 
                      padding: projectlinkTheme.spacing.sm,
                      background: projectlinkTheme.colors.background,
                      border: `1px solid ${projectlinkTheme.colors.border}`,
                      borderRadius: projectlinkTheme.borderRadius.md,
                      color: projectlinkTheme.colors.textPrimary,
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Barchasi</option>
                    <option value="14-16">14-16 yosh</option>
                    <option value="17-19">17-19 yosh</option>
                    <option value="20+">20+ yosh</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: projectlinkTheme.spacing.sm }}>
                  <FiBriefcase size={20} style={{ color: projectlinkTheme.colors.textSecondary }} />
                  <select 
                    value={selectedInterest} 
                    onChange={(e) => handleInterestChange(e.target.value)}
                    style={{ 
                      padding: projectlinkTheme.spacing.sm,
                      background: projectlinkTheme.colors.background,
                      border: `1px solid ${projectlinkTheme.colors.border}`,
                      borderRadius: projectlinkTheme.borderRadius.md,
                      color: projectlinkTheme.colors.textPrimary,
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Masalalar</option>
                    <option value="web">Veb开发</option>
                    <option value="mobile">Mobil ilovalar</option>
                    <option value="design">Dizayn</option>
                    <option value="research">Ilmiy tadqiqot</option>
                    <option value="ai">AI/ML</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: projectlinkTheme.spacing.sm }}>
                  <FiAward size={20} style={{ color: projectlinkTheme.colors.textSecondary }} />
                  <select 
                    value={selectedRole} 
                    onChange={(e) => handleRoleChange(e.target.value)}
                    style={{ 
                      padding: projectlinkTheme.spacing.sm,
                      background: projectlinkTheme.colors.background,
                      border: `1px solid ${projectlinkTheme.colors.border}`,
                      borderRadius: projectlinkTheme.borderRadius.md,
                      color: projectlinkTheme.colors.textPrimary,
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Rol</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Dizayner</option>
                    <option value="smm">SMM mutaxassisi</option>
                    <option value="researcher">Tadqiqotchi</option>
                  </select>
                </div>
                
                <Button variant="primary" onClick={handleApplyFilters}>
                  Filtrlarni qo‘llash
                </Button>
              </div>
              
              <ProjectsGrid>
                <AnimatePresence>
                  {filteredProjects().map((project) => (
                    <ProjectCard
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProjectImage image={project.image}>
                        <ProjectBadge status={project.status}>{project.status}</ProjectBadge>
                      </ProjectImage>
                      
                      <ProjectContent>
                        <ProjectTitle>{project.title}</ProjectTitle>
                        <ProjectDescription>{project.description}</ProjectDescription>
                        
                        <ProjectMeta>
                          <ProjectMetaItem>
                            <FiUser /> <span>{project.age} yosh</span>
                          </ProjectMetaItem>
                          <ProjectMetaItem>
                            <FiClock /> <span>{formatDistanceToNow(new Date(project.postedDate), { addSuffix: true })}</span>
                          </ProjectMetaItem>
                          <ProjectMetaItem>
                            <FiUsers /> <span>{project.applications} ariza</span>
                          </ProjectMetaItem>
                        </ProjectMeta>
                        
                        <ProjectTags>
                          {project.tags.map((tag, index) => (
                            <ProjectTag key={index}>{tag}</ProjectTag>
                          ))}
                        </ProjectTags>
                        
                        <ProjectFooter>
                          <ProjectOwner>
                            <ProjectOwnerAvatar avatar={project.ownerAvatar}>
                              {project.ownerInitials}
                            </ProjectOwnerAvatar>
                            <ProjectOwnerInfo>
                              <h4>{project.owner}</h4>
                              <p>Project Owner</p>
                            </ProjectOwnerInfo>
                          </ProjectOwner>
                          <ApplyButton onClick={() => handleProjectApply(project.id)}>
                            Apply Now <FiArrowRight />
                          </ApplyButton>
                        </ProjectFooter>
                      </ProjectContent>
                    </ProjectCard>
                  ))}
                </AnimatePresence>
              </ProjectsGrid>
            </Container>
          </Section>

          {/* How It Works Section */}
          <Section id="how-it-works" alt>
            <Container>
              <SectionTitle>Qanday ishlaydi</SectionTitle>
              <SectionSubtitle>
                Platformamiz qanday ishlaydi - sizdan qanday foydalanishni talab qilmaydi
              </SectionSubtitle>
              
              <StepsGrid>
                {[
                  { icon: FiBriefcase, title: 'Loyiha e’lon', description: 'Loyiha tashabbuskorlari o‘z loyihalari haqida e’lon joylaydilar, maqsadlar, zarur rollar va bazdarilgan natijalar ko‘rsatiladi.' },
                  { icon: FiUser, title: 'O‘quvchi profili', description: 'O‘quvchilar o‘z qiziqishlarini, ko‘nikmalarini, tajribasini va portfolio havolalarini ko‘rsatib, mos loyihalarni topadi.' },
                  { icon: FiFilter, title: 'Moslashtirish va ariza', description: 'O‘quvchilar o‘z ko‘nikmalari, yoshi va bo‘sh vaqti asosida loyihalarni filtrlaydilar va qatnashish uchun ariza yuboradilar.' },
                  { icon: FiUsers, title: 'Jamoa shakllanishi', description: 'Loyiha egasi arizalarni ko‘rib chiqadi va o‘z jamoasiga kerakli a’zolarni tanlayadi.' },
                  { icon: FiAward, title: 'Portfolio natijasi', description: 'Yakunlangan loyiha, bajarilgan rol va natija profilga qo‘shiladi, portfolio yaratiladi va amaliy tajriba ko‘rsatiladi.' },
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <StepCard key={index}>
                      <StepNumber>{index + 1}</StepNumber>
                      <StepIcon>{Icon({ size: 40 })}</StepIcon>
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </StepCard>
                  );
                })}
              </StepsGrid>
            </Container>
          </Section>

          {/* About Section */}
          <Section id="about">
            <Container>
              <AboutSection>
                <AboutContent>
                  <AboutTitle>ProjectLink Haqida</AboutTitle>
                  <AboutText>
                    ProjectLink - O‘zbekistondagi o‘quvchilar uchun mahalliy loyihalar va jamoa a’zolarini topish platformasi. Biz talabalar va yoshlar amaliy tajriba olish, portfolio yaratish va real loyihalarda ko‘nikmalarini sinovdan o‘tashu uchun ishtiyojni qondirish uchun ishlab chiqilganmiz.
                  </AboutText>
                  
                  <FeaturesGrid>
                    {[
                      { icon: FiCheck, text: 'Amaliy tajriba olish' },
                      { icon: FiUsers, text: 'Jamoaviy ish' },
                      { icon: FiAward, text: 'Portfolio yaratish' },
                      { icon: FiGlobe, text: 'Yangi aloqalar' },
                    ].map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <FeatureItem key={index}>
                          <Icon />
                          <span>{feature.text}</span>
                        </FeatureItem>
                      );
                    })}
                  </FeaturesGrid>
                  
                  <StatsSection>
                    <StatItem>
                      <StatValue>14-20</StatValue>
                      <StatDescription>Maqsadli auditoriya</StatDescription>
                    </StatItem>
                    <StatItem>
                      <StatValue>MVP</StatValue>
                      <StatDescription>Oddiy veb-sahifa yoki Telegram bot</StatDescription>
                    </StatItem>
                    <StatItem>
                      <StatValue>85%</StatValue>
                      <StatDescription>Muvaffaqiyat darajasi</StatDescription>
                    </StatItem>
                  </StatsSection>
                </AboutContent>
                
                <AboutImage>
                  <img 
                    src="https://projectlink.uz/_next/static/media/desktop-badge.23c0ee96805e7e31.webp" 
                    alt="projectlink Agent Design Inspiration"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </AboutImage>
              </AboutSection>
            </Container>
          </Section>

          {/* Contact Section */}
          <Section id="contact" alt>
            <Container>
              <SectionTitle>Bog‘lo‘bomalyish</SectionTitle>
              <SectionSubtitle>
                Biz bilan aloqali vostoqe qo‘llang
              </SectionSubtitle>
              
              <ContactSection>
                <ContactForm onSubmit={handleSubmit(handleContactSubmit)}>
                  <FormGroup>
                    <FormLabel>Ism</FormLabel>
                    <FormInput
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Ismingizni kiriting"
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Email</FormLabel>
                    <FormInput
                      {...register('email', { required: 'Email is required' })}
                      type="email"
                      placeholder="example@email.com"
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Mavzu</FormLabel>
                    <FormInput
                      {...register('subject', { required: 'Subject is required' })}
                      placeholder="Xabar mavzusi"
                    />
                    {errors.subject && <ErrorMessage>{errors.subject.message}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Xabar</FormLabel>
                    <FormTextarea
                      {...register('message', { required: 'Message is required' })}
                      placeholder="Xabaringizni yozing..."
                    />
                    {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
                  </FormGroup>
                  
                  <Button variant="primary" type="submit">
                    Xabar yuborish <FiEnvelope />
                  </Button>
                </ContactForm>
                
                <ContactInfo>
                  <ContactItem>
                    <ContactIcon>
                      <FiEnvelope />
                    </ContactIcon>
                    <ContactText>
                      <h3>Email</h3>
                      <p>info@projectlink.uz</p>
                    </ContactText>
                  </ContactItem>
                  
                  <ContactItem>
                    <ContactIcon>
                      <FiPhone />
                    </ContactIcon>
                    <ContactText>
                      <h3>Telefon</h3>
                      <p>+998 90 123 45 67</p>
                    </ContactText>
                  </ContactItem>
                  
                  <ContactItem>
                    <ContactIcon>
                      <FiMapPin />
                    </ContactIcon>
                    <ContactText>
                      <h3>Manzil</h3>
                      <p>Tashkent, O‘zbekiston</p>
                    </ContactText>
                  </ContactItem>
                </ContactInfo>
              </ContactSection>
            </Container>
          </Section>
        </main>

        {/* Footer */}
        <Footer>
          <Container>
            <FooterContent>
              <FooterBrand>
                <Logo>
                  <FiBriefcase />
                  <span>Project<span style={{ color: projectlinkTheme.colors.accent }}>Link</span></span>
                </Logo>
                <p style={{ 
                  color: projectlinkTheme.colors.textSecondary,
                  lineHeight: '1.7',
                  maxWidth: '400px',
                  marginTop: projectlinkTheme.spacing.md
                }}>
                  O‘zbekistondagi o‘quvchilar uchun mahalliy loyihalar va jamoa a’zolarini topish platformasi
                </p>
              </FooterBrand>
              
              <FooterLinks>
                <FooterTitle>Foydali havolalar</FooterTitle>
                <FooterLinkList>
                  {['Bosh sahifa', 'Loyihalar', 'Qanday ishlaydi', 'Haqida', 'Bog‘lobo‘lyish'].map((link, index) => (
                    <FooterLink key={index}>
                      <a href={`#${link.toLowerCase().replace(' ', '-')}`}>
                        {link}
                      </a>
                    </FooterLink>
                  ))}
                </FooterLinkList>
              </FooterLinks>
              
              <FooterLinks>
                <FooterTitle>Platformalarda boramiz</FooterTitle>
                <FooterLinkList>
                  {[
                    { icon: FiBriefcase, name: 'Telegram', link: '#' },
                    { icon: FiUsers, name: 'Discord', link: '#' },
                    { icon: FiAward, name: 'Slack', link: '#' },
                    { icon: FiGlobe, name: 'WhatsApp', link: '#' },
                    { icon: FiEnvelope, name: 'Email', link: '#' },
                  ].map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <FooterLink key={index}>
                        <a href={social.link}>
                          <Icon size={16} /> {social.name}
                        </a>
                      </FooterLink>
                    );
                  })}
                </FooterLinkList>
              </FooterLinks>
            </FooterContent>
            
            <FooterBottom>
              <p>&copy; 2024 ProjectLink. Barcha huquqlar himoyalangan.</p>
            </FooterBottom>
          </Container>
        </Footer>

        {/* Login Modal */}
        <Modal isOpen={isLoginModalOpen} onClick={() => setIsLoginModalOpen(false)}>
          <ModalContent
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalClose onClick={() => setIsLoginModalOpen(false)}>&times;</ModalClose>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ marginBottom: projectlinkTheme.spacing.xl }}>Kirish</h2>
              <form onSubmit={handleSubmit(handleLogin)} style={{ display: 'flex', flexDirection: 'column', gap: projectlinkTheme.spacing.lg }}>
                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <FormInput
                    {...loginForm.register('email', { required: 'Email is required' })}
                    type="email"
                    placeholder="example@email.com"
                  />
                  {loginForm.formState.errors.email && (
                    <ErrorMessage>{loginForm.formState.errors.email.message}</ErrorMessage>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Parol</FormLabel>
                  <FormInput
                    {...loginForm.register('password', { required: 'Password is required' })}
                    type="password"
                    placeholder="Parolingizni kiriting"
                  />
                  {loginForm.formState.errors.password && (
                    <ErrorMessage>{loginForm.formState.errors.password.message}</ErrorMessage>
                  )}
                </FormGroup>
                
                <Button variant="primary" type="submit" size="lg" style={{ width: '100%' }}>
                  Kirish
                </Button>
              </form>
            </div>
          </ModalContent>
        </Modal>

        {/* Register Modal */}
        <Modal isOpen={isRegisterModalOpen} onClick={() => setIsRegisterModalOpen(false)}>
          <ModalContent
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalClose onClick={() => setIsRegisterModalOpen(false)}>&times;</ModalClose>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ marginBottom: projectlinkTheme.spacing.xl }}>Ro‘yxatdan o‘tish</h2>
              <form onSubmit={handleSubmit(handleRegister)} style={{ display: 'flex', flexDirection: 'column', gap: projectlinkTheme.spacing.lg }}>
                <FormGroup>
                  <FormLabel>Ism</FormLabel>
                  <FormInput
                    {...registerForm.register('name', { required: 'Name is required' })}
                    placeholder="Ismingizni kiriting"
                  />
                  {registerForm.formState.errors.name && (
                    <ErrorMessage>{registerForm.formState.errors.name.message}</ErrorMessage>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <FormInput
                    {...registerForm.register('email', { required: 'Email is required' })}
                    type="email"
                    placeholder="example@email.com"
                  />
                  {registerForm.formState.errors.email && (
                    <ErrorMessage>{registerForm.formState.errors.email.message}</ErrorMessage>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Parol</FormLabel>
                  <FormInput
                    {...registerForm.register('password', { required: 'Password is required' })}
                    type="password"
                    placeholder="Parolingizni kiriting"
                  />
                  {registerForm.formState.errors.password && (
                    <ErrorMessage>{registerForm.formState.errors.password.message}</ErrorMessage>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Parolni tasdiqlash</FormLabel>
                  <FormInput
                    {...registerForm.register('confirmPassword', { required: 'Confirm password is required' })}
                    type="password"
                    placeholder="Parolingizni tasdiqlang"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <ErrorMessage>{registerForm.formState.errors.confirmPassword.message}</ErrorMessage>
                  )}
                </FormGroup>
                
                <Button variant="primary" type="submit" size="lg" style={{ width: '100%' }}>
                  Ro‘yxatdan o‘tish
                </Button>
              </form>
            </div>
          </ModalContent>
        </Modal>
      </GreekPattern>
    </ToastContainer>
  );
};

export default ProjectLinkApp;
