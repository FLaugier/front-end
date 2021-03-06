import * as yup from 'yup';
import React from 'react';
import moment from 'moment';
import { Col, Form } from 'react-bootstrap';
import { Formik } from 'formik';

import PrimaryButton from '../../../components/PrimaryButton';

const schema = yup.object({
  name: yup.string().required(),
  city: yup.string().required(),
  // coachName: yup.string().required(),
});
const WorkshopModalForm = ({ t, coaches, handleSubmit }) => {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={{
        startAt: moment().format('DD/MM/YYYY'),
        name: '',
        coachId: coaches && coaches[0].id,
        // status: 'En préparation',
        city: '',
      }}
    >
      {({ handleSubmit, handleChange, values, errors }) => {
        return (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} controlId="validationFormik01">
                <Form.Label>{t('common.workshopName')}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormik01">
                <Form.Label>{t('common.date')}</Form.Label>
                <Form.Control
                  type="text"
                  name="startAt"
                  value={values.startAt}
                  onChange={handleChange}
                  isInvalid={!moment(values.startAt, 'DD/MM/YYYY').isValid()}
                />
                <Form.Control.Feedback type="invalid">
                  invalid date
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormik02">
                <Form.Label>{t('common.workshopCity')}</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  isInvalid={!!errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormik03">
                <Form.Label>{t('common.coach')}</Form.Label>
                <Form.Control
                  as="select"
                  name="coachId"
                  value={values.coachId}
                  onChange={handleChange}
                >
                  {coaches.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.email}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <div style={{ textAlign: 'right' }}>
              <PrimaryButton type="submit">
                {t('common.createWorkshop')}
              </PrimaryButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default WorkshopModalForm;
