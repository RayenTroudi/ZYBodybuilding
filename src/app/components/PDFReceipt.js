'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Tailwind-inspired color palette matching your brand
const colors = {
  primary: '#CC1303',      // Engineering Orange
  primaryDark: '#B80C02',  // Darker Orange
  accent: '#C30B02',       // Accent Orange
  dark: '#000000',         // Black
  darkGray: '#1a1a1a',
  mediumGray: '#4a4a4a',
  lightGray: '#e5e5e5',
  veryLightGray: '#f5f5f5',
  white: '#ffffff',
  success: '#10b981',
  text: '#333333',
  textLight: '#666666',
};

// Get period type label based on duration
const getPeriodType = (duration) => {
  if (duration <= 7) return 'Hebdomadaire';
  if (duration >= 28 && duration <= 31) return 'Mensuel';
  if (duration >= 84 && duration <= 93) return 'Trimestriel';
  if (duration >= 365 && duration <= 366) return 'Annuel';
  return 'Personnalisé';
};

// Create styles inspired by Tailwind CSS
const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    padding: 30,
    fontSize: 9,
  },
  
  // Header Section
  header: {
    marginBottom: 15,
    borderBottom: `2px solid ${colors.primary}`,
    paddingBottom: 10,
  },
  
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  logo: {
    width: 45,
    height: 45,
  },
  
  brandTextContainer: {
    flexDirection: 'column',
  },
  
  brandName: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.dark,
    letterSpacing: 0.5,
  },
  
  brandNameOrange: {
    color: colors.primary,
  },
  
  brandTagline: {
    fontSize: 8,
    color: colors.textLight,
    marginTop: 2,
  },
  
  receiptInfo: {
    alignItems: 'flex-end',
  },
  
  receiptTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 3,
  },
  
  receiptNumber: {
    fontSize: 9,
    color: colors.textLight,
    marginBottom: 2,
  },
  
  receiptDate: {
    fontSize: 8,
    color: colors.textLight,
  },
  
  // Customer Section
  customerSection: {
    marginBottom: 15,
    backgroundColor: colors.veryLightGray,
    padding: 12,
    borderRadius: 6,
    borderLeft: `3px solid ${colors.primary}`,
  },
  
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.dark,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  customerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  
  customerLabel: {
    fontSize: 8,
    color: colors.textLight,
    width: 100,
    fontWeight: 600,
  },
  
  customerValue: {
    fontSize: 8,
    color: colors.text,
    flex: 1,
  },
  
  // Subscription Details
  subscriptionSection: {
    marginBottom: 15,
  },
  
  planCard: {
    backgroundColor: colors.veryLightGray,
    padding: 12,
    borderRadius: 6,
    borderTop: `2px solid ${colors.primary}`,
  },
  
  planName: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.dark,
    marginBottom: 6,
  },
  
  planDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  
  planLabel: {
    fontSize: 8,
    color: colors.textLight,
    fontWeight: 600,
  },
  
  planValue: {
    fontSize: 8,
    color: colors.text,
    fontWeight: 600,
  },
  
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTop: `1px solid ${colors.lightGray}`,
  },
  
  dateBox: {
    flex: 1,
    alignItems: 'center',
    padding: 6,
    backgroundColor: colors.white,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  
  dateLabel: {
    fontSize: 7,
    color: colors.textLight,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  dateValue: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: 700,
  },
  
  // Payment Section
  paymentSection: {
    marginBottom: 15,
  },
  // Payment Section
  paymentSection: {
    marginBottom: 15,
  },
  
  paymentTable: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 6,
    overflow: 'hidden',
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 8,
  },
  
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    padding: 8,
    backgroundColor: colors.white,
  },
  
  tableRowAlt: {
    backgroundColor: colors.veryLightGray,
  },
  
  tableCell: {
    fontSize: 8,
    color: colors.text,
  },
  
  tableCellBold: {
    fontWeight: 700,
  },
  
  col1: { width: '60%' },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  
  // Summary Section
  summarySection: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  
  summaryBox: {
    width: '45%',
    backgroundColor: colors.veryLightGray,
    padding: 10,
    borderRadius: 6,
    borderLeft: `3px solid ${colors.primary}`,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  
  summaryLabel: {
    fontSize: 9,
    color: colors.textLight,
    fontWeight: 600,
  },
  
  summaryValue: {
    fontSize: 9,
    color: colors.text,
    fontWeight: 600,
  },
  
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTop: `2px solid ${colors.primary}`,
  },
  
  totalLabel: {
    fontSize: 11,
    color: colors.dark,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  
  totalValue: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: 700,
  },
  
  // Payment Method Badge
  paymentMethodSection: {
    marginTop: 15,
    marginBottom: 15,
  },
  
  paymentMethodBadge: {
    backgroundColor: colors.success,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  
  paymentMethodText: {
    fontSize: 9,
    color: colors.white,
    fontWeight: 700,
  },
  
  // Footer Section
  footer: {
    marginTop: 'auto',
    paddingTop: 15,
    borderTop: `2px solid ${colors.lightGray}`,
  },
  
  thankYouText: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  
  footerInfo: {
    backgroundColor: colors.darkGray,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  
  footerLabel: {
    fontSize: 7,
    color: colors.lightGray,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  
  footerValue: {
    fontSize: 8,
    color: colors.white,
    fontWeight: 600,
  },
  
  disclaimer: {
    fontSize: 6,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 1.4,
  },
  
  // Watermark
  watermark: {
    position: 'absolute',
    fontSize: 80,
    color: colors.lightGray,
    opacity: 0.04,
    transform: 'rotate(-45deg)',
    top: '40%',
    left: '20%',
    fontWeight: 700,
  },
});

const PDFReceipt = ({ data }) => {
  const {
    member,
    plan,
    startDate,
    endDate,
    payment,
    paymentMethod,
    timestamp,
  } = data;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-TN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return `${parseFloat(price).toLocaleString('fr-TN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} TND`;
  };

  const calculateTax = (amount) => {
    return amount * 0.19; // 19% TVA
  };

  const tax = calculateTax(parseFloat(payment));
  const subtotal = parseFloat(payment) - tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>ZY BODYBUILDING</Text>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* Logo and Brand */}
            <View style={styles.logoSection}>
              <Image
                src="/images/logoNobg.png"
                style={styles.logo}
              />
              <View style={styles.brandTextContainer}>
                <Text style={styles.brandName}>
                  <Text style={styles.brandNameOrange}>ZY</Text> BODYBUILDING
                </Text>
                <Text style={styles.brandTagline}>
                  Gym & Fitness Center
                </Text>
              </View>
            </View>

            {/* Receipt Info */}
            <View style={styles.receiptInfo}>
              <Text style={styles.receiptTitle}>REÇU</Text>
              <Text style={styles.receiptNumber}>
                N° {member.memberId}
              </Text>
              <Text style={styles.receiptDate}>
                {formatDate(timestamp)}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.customerSection}>
          <Text style={styles.sectionTitle}>Informations Client</Text>
          <View style={styles.customerRow}>
            <Text style={styles.customerLabel}>Nom Complet:</Text>
            <Text style={styles.customerValue}>{member.name}</Text>
          </View>
          <View style={styles.customerRow}>
            <Text style={styles.customerLabel}>ID Membre:</Text>
            <Text style={styles.customerValue}>{member.memberId}</Text>
          </View>
          <View style={styles.customerRow}>
            <Text style={styles.customerLabel}>Email:</Text>
            <Text style={styles.customerValue}>{member.email}</Text>
          </View>
          <View style={styles.customerRow}>
            <Text style={styles.customerLabel}>Téléphone:</Text>
            <Text style={styles.customerValue}>{member.phone}</Text>
          </View>
          {member.address && (
            <View style={styles.customerRow}>
              <Text style={styles.customerLabel}>Adresse:</Text>
              <Text style={styles.customerValue}>{member.address}</Text>
            </View>
          )}
        </View>

        {/* Subscription Details */}
        <View style={styles.subscriptionSection}>
          <Text style={styles.sectionTitle}>Détails de l'Abonnement</Text>
          <View style={styles.planCard}>
            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.planDetailsRow}>
              <Text style={styles.planLabel}>Durée:</Text>
              <Text style={styles.planValue}>
                {plan.duration} jour{plan.duration > 1 ? 's' : ''}
              </Text>
            </View>

            {/* Dates */}
            <View style={styles.datesContainer}>
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>Date de Début</Text>
                <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
              </View>
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>Date d'Expiration</Text>
                <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Détails du Paiement</Text>
          <View style={styles.paymentTable}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>Qté</Text>
              <Text style={[styles.tableHeaderText, styles.col3]}>Montant</Text>
            </View>

            {/* Table Rows */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                Abonnement - {plan.name}
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>1</Text>
              <Text style={[styles.tableCell, styles.tableCellBold, styles.col3]}>
                {formatPrice(payment)}
              </Text>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summarySection}>
            <View style={styles.summaryBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>{formatPrice(payment)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodSection}>
          <View style={styles.paymentMethodBadge}>
            <Text style={styles.paymentMethodText}>
              ✓ PAYÉ PAR {paymentMethod.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.thankYouText}>
            Merci pour votre confiance!
          </Text>

          <Text style={styles.disclaimer}>
            Ce reçu est généré électroniquement et constitue une preuve de paiement valide.{'\n'}
            Pour toute question, veuillez nous contacter à contact@zybodybuilding.tn
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFReceipt;
