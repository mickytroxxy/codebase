import * as Contacts from 'expo-contacts';
import { phoneNoValidation } from './methods';
import { LocalContact } from '@/src/state/slices/localContacts';
import { getUserDetailsByPhone } from './api';

const extractCountryCode = (phoneNumber: string): string => {
  // Extract the country code from the phone number
  // Handle both formats: 27733494836 or +27733494836
  const cleanNumber = phoneNumber.replace(/^\+/, ''); // Remove + if present
  const countryCode = cleanNumber.substring(0, 2); // Get first 2 digits
  return `+${countryCode}`; // Add + prefix back
};

export const getDeviceContacts = async (userPhoneNumber: string): Promise<LocalContact[]> => {
  try {
    // For testing purposes - return dummy contacts
    // const dummyContacts: LocalContact[] = [
    //   {
    //     id: '1',
    //     name: 'John Doe',
    //     phoneNumber: '27658016132',
    //     hasAccount: true,
    //     lastChecked: Date.now(),
    //     userId: 'user1',
    //     avatar: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=500',
    //     djInfo: {
    //       djName: 'DJ John',
    //       clubName: 'Club XYZ',
    //       genres: ['House', 'Techno'],
    //       time: new Date().toISOString()
    //     }
    //   },
    //   {
    //     id: '2',
    //     name: 'Jane Smith',
    //     phoneNumber: '27733494836',
    //     hasAccount: true,
    //     lastChecked: Date.now(),
    //     userId: 'user2',
    //     avatar: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=500',
    //     djInfo: {
    //       djName: 'DJ Jane',
    //       clubName: 'Club ABC',
    //       genres: ['Hip Hop', 'R&B'],
    //       time: new Date().toISOString()
    //     }
    //   },
    //   {
    //     id: '3',
    //     name: 'Mike Johnson',
    //     phoneNumber: '27712345678',
    //     hasAccount: false,
    //     lastChecked: Date.now()
    //   },
    //   {
    //     id: '4',
    //     name: 'Sarah Williams',
    //     phoneNumber: '27787654321',
    //     hasAccount: false,
    //     lastChecked: Date.now()
    //   },
    //   {
    //     id: '5',
    //     name: 'David Brown',
    //     phoneNumber: '27723456789',
    //     hasAccount: false,
    //     lastChecked: Date.now()
    //   }
    // ];

    // return dummyContacts;

    // Comment out the actual contacts fetching for now
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access contacts was denied');
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Name,
      ],
    });

    const validContacts: LocalContact[] = [];
    const now = Date.now();
    const userCountryCode = extractCountryCode(userPhoneNumber);

    for (const contact of data) {
      if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        for (const phone of contact.phoneNumbers) {
          if (phone?.number) {
            const validatedNumber = phoneNoValidation(phone.number, userCountryCode);
            if (validatedNumber) {
              validContacts.push({
                id: `${contact.id}-${validatedNumber}`,
                name: contact.name || 'Unknown',
                phoneNumber: validatedNumber,
                hasAccount: false,
                lastChecked: now,
              });
              break; // Break once we find a valid number for this contact
            }
          }
        }
      }
    }

    return validContacts;
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
};

export const checkContactsForAccounts = async (contacts: LocalContact[]): Promise<LocalContact[]> => {
  try {
    const updatedContacts = await Promise.all(
      contacts.map(async (contact) => {
        try {
          // Get user details by exact phone number match
          const users = await getUserDetailsByPhone(contact.phoneNumber);
          const user = users[0]; // Get the first matching user

          if (user) {
            return {
              ...contact,
              ...user,
              hasAccount: true,
              isContact:true,
              lastChecked: Date.now()
            };
          }

          return {
            ...contact,
            hasAccount: false,
            lastChecked: Date.now()
          };
        } catch (error) {
          console.error(`Error checking contact ${contact.id}:`, error);
          return contact;
        }
      })
    );

    return updatedContacts;
  } catch (error) {
    console.error('Error checking contacts for accounts:', error);
    throw error;
  }
}; 