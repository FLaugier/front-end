import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

import { getWorkshops } from '../utils/api';
import {
  retrieveWorkshops,
  workshopsLoadError,
  workshopsRetrieved,
} from '../actions/workshops';

// eslint-disable-next-line import/prefer-default-export
export const useWorkshops = () => {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const workshops = useSelector((state) => state.workshops);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getWorkshops();
        if (mounted.current) {
          dispatch(workshopsRetrieved(result));
        }
        return workshops;
      } catch (e) {
        if (mounted.current) {
          dispatch(workshopsLoadError(e));
        }
        return null;
      }
    };
    mounted.current = true;
    dispatch(retrieveWorkshops());
    load();
    return () => {
      mounted.current = false;
    };
  }, [dispatch]);

  return workshops;
};
