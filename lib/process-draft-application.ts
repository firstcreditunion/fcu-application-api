// 'use server'

// export const prepareForSubmission = async () => {
//     if (applicationType === 'PRIME') {
//       //* Mobile Number Verification
//       const primeMobileNumber =
//         primeContactDetailsForm.getValues('mobileNumber')

//       const primeClientMobileUniqueID =
//         supabaseIntegrityState.getValues('primeClientMobileUniqueID')

//       const primeMobileVerificationCompleted =
//         supabaseIntegrityState.getValues(
//           'mobileVerificationCompleted'
//         ) === true

//       //* Work Phone Number Verification
//       const primeWorkPhoneNumber =
//         primeContactDetailsForm.getValues('workPhoneNumber')

//       const primeClientWorkPhoneUniqueID =
//         supabaseIntegrityState.getValues('primeClientWorkPhoneUniqueID')

//       const primeWorkPhoneVerificationCompleted =
//         supabaseIntegrityState.getValues(
//           'workPhoneVerificationCompleted'
//         ) === true

//       //* Email Verification
//       const primeEmail =
//         primeContactDetailsForm.getValues('workPhoneNumber')

//       const primeEmailUniqueID =
//         supabaseIntegrityState.getValues('primeEmailUniqueID')

//       const primeEmailVerificationCompleted =
//         supabaseIntegrityState.getValues(
//           'emailVerificationCompleted'
//         ) === true

//       //* Residential Address Verification
//       const primeResidentialAddressPxid =
//         primeContactDetailsForm.getValues('residentialAddressPxid')

//       const primeResidentialAddressUniqueID =
//         supabaseIntegrityState.getValues(
//           'primeResidentialAddressUniqueID'
//         )

//       const primeResidentialAddressVerificationCompleted =
//         supabaseIntegrityState.getValues(
//           'residentialAddressVerificationCompleted'
//         ) === true

//       //* Mailing Address Verification
//       const primeMailingAddressPxid =
//         primeContactDetailsForm.getValues('mailingAddressPxid')

//       const primeMailingAddressUniqueID =
//         supabaseIntegrityState.getValues('primeMailingAddressUniqueID')

//       const primeMailingAddressVerificationCompleted =
//         supabaseIntegrityState.getValues(
//           'mailingAddressVerificationCompleted'
//         ) === true

//       //? API Call - Prime Mobile
//       if (
//         primeMobileVerificationCompleted === false &&
//         primeMobileNumber !== undefined &&
//         primeMobileNumber !== null &&
//         primeMobileNumber !== ''
//       ) {
//         const primeMobileVerificationMetaData = await verifyMobileNumber({
//           phoneNumber: primeMobileNumber,
//         })

//         if (
//           primeMobileVerificationMetaData &&
//           primeMobileVerificationMetaData?.success === true
//         ) {
//           //* Set Values for Submission (Internal State)
//           supabaseIntegrityState.setValue(
//             'mobileVerificationCompleted',
//             true
//           )
//           supabaseIntegrityState.setValue(
//             'sov_mobileNetwork',
//             processMobileNumber(
//               primeMobileVerificationMetaData?.formatted_national
//             ).sov_networkCode
//           )
//           supabaseIntegrityState.setValue(
//             'sov_mobileNumber',
//             processMobileNumber(
//               primeMobileVerificationMetaData?.formatted_national
//             ).sov_number
//           )
//           supabaseIntegrityState.setValue(
//             'sov_mobileCallingCode',
//             primeMobileVerificationMetaData.calling_code
//           )

//           //* Update Supabase
//           const phoneVerificationResultData: typeof updateType_tblClientPhone =
//             {
//               is_verified: primeMobileVerificationMetaData?.is_verified,
//               line_type: primeMobileVerificationMetaData?.line_type,
//               line_status: primeMobileVerificationMetaData?.line_status,
//               line_status_reason:
//                 primeMobileVerificationMetaData?.line_status_reason,
//               country_code: primeMobileVerificationMetaData?.country_code,
//               calling_code: primeMobileVerificationMetaData?.calling_code,
//               raw_national: primeMobileVerificationMetaData?.raw_national,
//               formatted_national:
//                 primeMobileVerificationMetaData?.formatted_national,
//               raw_international:
//                 primeMobileVerificationMetaData?.raw_international,
//               formatted_international:
//                 primeMobileVerificationMetaData?.formatted_international,
//               not_verified_code:
//                 primeMobileVerificationMetaData?.not_verified_code,
//               not_verified_reason:
//                 primeMobileVerificationMetaData?.not_verified_reason,
//               updated_datetime: convertToUTCTime(),
//               sov_networkCode:
//                 primeMobileVerificationMetaData?.formatted_national
//                   ? processMobileNumber(
//                       primeMobileVerificationMetaData?.formatted_national
//                     ).sov_networkCode
//                   : '',
//               sov_number: primeMobileVerificationMetaData?.formatted_national
//                 ? processMobileNumber(
//                     primeMobileVerificationMetaData?.formatted_national
//                   ).sov_number
//                 : '',
//               metadata: JSON.stringify(primeMobileVerificationMetaData),
//             }

//           if (
//             primeClientMobileUniqueID !== null &&
//             primeClientMobileUniqueID !== undefined
//           ) {
//             await tblClientPhoneUpdatePhoneVerificationDetails(
//               primeClientMobileUniqueID,
//               phoneVerificationResultData
//             )
//           }
//         }
//       }

//       //? API Call - Prime Work Phone
//       if (
//         primeWorkPhoneVerificationCompleted === false &&
//         primeWorkPhoneNumber !== undefined &&
//         primeWorkPhoneNumber !== null &&
//         primeWorkPhoneNumber !== ''
//       ) {
//         const primeWorkPhoneVerificationMetaData = await verifyPhoneNumber({
//           phoneNumber: primeWorkPhoneNumber,
//         })

//         if (
//           primeWorkPhoneVerificationMetaData &&
//           primeWorkPhoneVerificationMetaData?.success === true
//         ) {
//           //* Set Values for Submission (Internal State)
//           supabaseIntegrityState.setValue(
//             'mobileVerificationCompleted',
//             true
//           )
//           supabaseIntegrityState.setValue(
//             'sov_workNetwork',
//             processMobileNumber(
//               primeWorkPhoneVerificationMetaData?.formatted_national
//             ).sov_networkCode
//           )
//           supabaseIntegrityState.setValue(
//             'sov_workNumber',
//             processMobileNumber(
//               primeWorkPhoneVerificationMetaData?.formatted_national
//             ).sov_number
//           )
//           supabaseIntegrityState.setValue(
//             'sov_workCallingCode',
//             primeWorkPhoneVerificationMetaData.calling_code
//           )

//           //* Update Supabase
//           const phoneVerificationResultData: typeof updateType_tblClientPhone =
//             {
//               is_verified: primeWorkPhoneVerificationMetaData?.is_verified,
//               line_type: primeWorkPhoneVerificationMetaData?.line_type,
//               line_status: primeWorkPhoneVerificationMetaData?.line_status,
//               line_status_reason:
//                 primeWorkPhoneVerificationMetaData?.line_status_reason,
//               country_code: primeWorkPhoneVerificationMetaData?.country_code,
//               calling_code: primeWorkPhoneVerificationMetaData?.calling_code,
//               raw_national: primeWorkPhoneVerificationMetaData?.raw_national,
//               formatted_national:
//                 primeWorkPhoneVerificationMetaData?.formatted_national,
//               raw_international:
//                 primeWorkPhoneVerificationMetaData?.raw_international,
//               formatted_international:
//                 primeWorkPhoneVerificationMetaData?.formatted_international,
//               not_verified_code:
//                 primeWorkPhoneVerificationMetaData?.not_verified_code,
//               not_verified_reason:
//                 primeWorkPhoneVerificationMetaData?.not_verified_reason,
//               updated_datetime: convertToUTCTime(),
//               sov_stdCode:
//                 primeWorkPhoneVerificationMetaData?.formatted_national
//                   ? processMobileNumber(
//                       primeWorkPhoneVerificationMetaData?.formatted_national
//                     ).sov_networkCode
//                   : '',
//               sov_number:
//                 primeWorkPhoneVerificationMetaData?.formatted_national
//                   ? processMobileNumber(
//                       primeWorkPhoneVerificationMetaData?.formatted_national
//                     ).sov_number
//                   : '',
//               metadata: JSON.stringify(primeWorkPhoneVerificationMetaData),
//             }

//           if (
//             primeClientWorkPhoneUniqueID !== null &&
//             primeClientWorkPhoneUniqueID !== undefined
//           ) {
//             await tblClientPhoneUpdatePhoneVerificationDetails(
//               primeClientWorkPhoneUniqueID,
//               phoneVerificationResultData
//             )
//           }
//         }
//       }

//       //? API Call - Prime Email
//       if (
//         primeEmailVerificationCompleted === false &&
//         primeEmail !== undefined &&
//         primeEmail !== null &&
//         primeEmail !== ''
//       ) {
//         const primeEmailVerificationMetaData = await verifyEmailAddress({
//           emailAddress: primeEmail,
//         })

//         if (
//           primeEmailVerificationMetaData &&
//           primeEmailVerificationMetaData?.success === true
//         ) {
//           //* Set Values for Submission (Internal State)
//           supabaseIntegrityState.setValue(
//             'emailVerificationCompleted',
//             true
//           )
//           supabaseIntegrityState.setValue(
//             'emailVerificationMetadata',
//             JSON.stringify(primeEmailVerificationMetaData)
//           )

//           //* Update Supabase

//         }
//       }

//       //? API Call - Prime Residential Address
//       if (
//         primeResidentialAddressVerificationCompleted === false &&
//         primeResidentialAddressPxid !== undefined &&
//         primeResidentialAddressPxid !== null &&
//         primeResidentialAddressPxid !== ''
//       ) {
//         const primeResidentialAddressVerificationMetaData =
//           await getExactAddressFromPxid({
//             pxid: primeResidentialAddressPxid,
//           })

//         console.log(
//           'primeResidentialAddressVerificationMetaData: ',
//           primeResidentialAddressVerificationMetaData
//         )
//       }

//       //? API Call - Prime Mailing Address
//       if (
//         primeMailingAddressVerificationCompleted === false &&
//         primeMailingAddressPxid !== undefined &&
//         primeMailingAddressPxid !== null &&
//         primeMailingAddressPxid !== ''
//       ) {
//         const primeMailingAddressVerificationMetaData =
//           await getExactAddressFromPxid({
//             pxid: primeMailingAddressPxid,
//           })

//         console.log(
//           'primeMailingAddressVerificationMetaData: ',
//           primeMailingAddressVerificationMetaData
//         )
//       }
//     }
//   }
