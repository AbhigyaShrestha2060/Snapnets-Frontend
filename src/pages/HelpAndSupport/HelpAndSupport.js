import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E60023',
      light: '#ff1a1a',
      dark: '#b3001b',
      contrastText: '#ffffff',
    },
  },
});

const faqs = [
  {
    question: 'How do I reset my password?',
    answer:
      'To reset your password, go to the login page and click on the "Forget Password" link. Follow the instructions sent to your registered email.',
  },
  {
    question: 'How can I contact customer support?',
    answer:
      'You can reach our support team using the contact form below, by emailing support@snapnets.com, or by calling our 24/7 hotline at +1-800-SNAPNETS.',
  },
  {
    question: 'Where can I learn more about Snapnets features?',
    answer:
      'Visit our Features page to explore what Snapnets has to offer. We regularly update our features based on user feedback.',
  },
  {
    question: 'What are the system requirements?',
    answer:
      'Snapnets works on all modern browsers including Chrome, Firefox, Safari, and Edge. For mobile devices, we support iOS 12+ and Android 8+.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we use industry-standard encryption and security measures to protect your data. All information is stored in secure, encrypted servers.',
  },
];

const HelpAndSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSnackbar({
      open: true,
      message: "Message sent successfully! We'll respond within 24 hours.",
      severity: 'success',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth='lg'
        sx={{ py: 4 }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 2,
          }}>
          <Typography
            variant='h3'
            gutterBottom>
            Help and Support
          </Typography>
          <Typography variant='h6'>
            We're here to help you get the most out of Snapnets
          </Typography>
        </Paper>

        {/* FAQs Section */}
        <Typography
          variant='h4'
          sx={{ mb: 3 }}>
          Frequently Asked Questions
        </Typography>
        <Paper sx={{ mb: 4, borderRadius: 2 }}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              elevation={0}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                    color: 'primary.main',
                  },
                }}>
                <Typography
                  variant='subtitle1'
                  fontWeight='medium'>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color='text.secondary'>{faq.answer}</Typography>
              </AccordionDetails>
              {index !== faqs.length - 1 && <Divider />}
            </Accordion>
          ))}
        </Paper>

        {/* Contact Form */}
        <Typography
          variant='h4'
          sx={{ mb: 3 }}>
          Contact Us
        </Typography>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate>
            <Grid
              container
              spacing={3}>
              <Grid
                item
                xs={12}
                sm={6}>
                <TextField
                  required
                  fullWidth
                  label='Your Name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}>
                <TextField
                  required
                  fullWidth
                  label='Email Address'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <TextField
                  required
                  fullWidth
                  label='Subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label='Message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  sx={{
                    minWidth: 200,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}>
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{
              '& .MuiAlert-icon': {
                color: 'primary.main',
              },
            }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default HelpAndSupport;
