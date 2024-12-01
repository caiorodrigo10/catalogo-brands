import { AnalyticsBrowserAPI } from "@/types/analytics";
import { trackOnboardingCompleted } from "@/lib/analytics/onboarding";
import { toast } from "sonner";

interface QuizData {
  productCategories: string[];
  profileType: string;
  brandStatus: string;
  launchUrgency: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const trackSignUpEvents = async (
  userId: string,
  userData: UserData,
  quizData: QuizData,
  retries = 3
): Promise<void> => {
  if (!window.analytics) {
    if (retries > 0) {
      setTimeout(() => trackSignUpEvents(userId, userData, quizData, retries - 1), 1000);
      return;
    }
    toast.error('Erro ao registrar eventos de analytics');
    return;
  }

  try {
    window.analytics.identify(userId, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      language: 'pt',
      product_interest: quizData.productCategories,
      profile_type: quizData.profileType,
      brand_status: quizData.brandStatus,
      launch_urgency: quizData.launchUrgency
    });

    window.analytics.track('user_signed_up', {
      userId,
      ...userData,
      signupMethod: 'email',
      language: 'pt',
      ...quizData,
      onboarding_completed: true,
      source: 'comecarpt'
    });

    trackOnboardingCompleted(userId, {
      profile_type: quizData.profileType,
      product_interest: quizData.productCategories,
      brand_status: quizData.brandStatus,
      language: 'pt',
      source: 'comecarpt'
    }, 'comecarpt');

  } catch (error) {
    if (retries > 0) {
      setTimeout(() => trackSignUpEvents(userId, userData, quizData, retries - 1), 1000);
    } else {
      toast.error('Erro ao registrar eventos de analytics');
    }
  }
};