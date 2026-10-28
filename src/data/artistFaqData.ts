// FAQ content extracted from the supplied ArtistManch FAQ Questions & Answers draft.
export type ArtistFaqItem = { category: string; question: string; answer: string };

export const ARTIST_FAQ_CATEGORIES = [
  "General ArtistManch FAQs",
  "Celebrity Appearance",
  "Dancers & Troupes",
  "Instrumentalist",
  "Magician",
  "Photographer/Videographer",
  "Comedian",
  "Model",
  "Emcee/Anchor",
  "DJ",
  "Live Bands",
  "Makeup Artists & Stylists",
  "Singer",
  "Speaker",
  "Variety Artist",
  "Influencer"
] as const;

export const ARTIST_FAQS: ArtistFaqItem[] = [
  {
    "category": "General ArtistManch FAQs",
    "question": "What is ArtistManch, and how does the booking process work?",
    "answer": "ArtistManch helps clients discover artists and send booking enquiries for events and campaigns. Browse a category, review profiles and portfolios, share your event details, and confirm availability, pricing, deliverables, and terms with the artist before treating the booking as final."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "How do I search for artists by category, location, event date, and budget?",
    "answer": "Use the category and any available filters to narrow results by location, event date, style, or budget. If a filter is not available, include those preferences in your enquiry so the artist can confirm whether they are a fit."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "Can I contact an artist before sending a booking request?",
    "answer": "If the profile provides an enquiry or contact option, use it to share your requirements. Keep important details and agreed terms in the platform's supported booking flow where possible."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "What details should I include in a booking enquiry?",
    "answer": "Include the event date, start and end time, venue city, event type, audience size, preferred artist or style, budget range, expected deliverables, and any technical or travel requirements. Clear details help the artist provide a relevant quote."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "How do I know whether an artist is available on my event date?",
    "answer": "Availability should be confirmed directly for your exact date, timings, location, and event duration. A profile being visible does not by itself guarantee that the artist is free."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "How are quotes, artist fees, platform charges, and taxes displayed?",
    "answer": "Ask for an itemised quote showing the artist fee and any applicable travel, equipment, production, platform, or tax charges. Confirm the final amount and what is included in writing before paying."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "When is a booking considered confirmed?",
    "answer": "Treat a booking as confirmed only after the artist has accepted the request and both sides have agreed on the date, timings, deliverables, price, payment schedule, and cancellation terms. Follow any confirmation steps shown in ArtistManch."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "How do payments, deposits, and remaining balances work?",
    "answer": "Follow the payment instructions shown for your booking and ask for the due dates, deposit amount, balance deadline, and accepted payment methods. Do not assume a payment schedule unless it has been clearly communicated and agreed."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "What is ArtistManch's cancellation, refund, and rescheduling policy?",
    "answer": "ArtistManch helps clients discover artists and send booking enquiries for events and campaigns. Browse a category, review profiles and portfolios, share your event details, and confirm availability, pricing, deliverables, and terms with the artist before treating the booking as final."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "What should I do if an artist or client does not respond?",
    "answer": "Send a concise follow-up with the event date and response deadline. If you still do not hear back, contact another suitable artist and use ArtistManch's available support channel if one is provided."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "How can I report a concern or request help with a booking?",
    "answer": "Collect the booking reference, relevant messages, payment records, and a short description of the issue, then contact ArtistManch through its published support channel. Avoid sharing passwords or sensitive payment credentials."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "How does ArtistManch verify artist profiles and portfolios?",
    "answer": "Review the profile details, portfolio, references, and any verification indicators displayed on ArtistManch. If something is unclear, ask for supporting information; do not assume every profile detail has been independently verified unless the platform explicitly says so."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "Can I book artists for events outside my city?",
    "answer": "You can enquire with artists based in other cities, but confirm travel availability, transport, accommodation, setup time, and associated costs before finalising the booking."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "Can I request a customised package for multiple artists?",
    "answer": "Share the complete event schedule, the artists or categories you need, individual set timings, venue details, and total budget. Ask for one written proposal that clearly lists each performer, deliverable, fee, and responsibility."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "How is my personal and payment information protected?",
    "answer": "Follow the payment instructions shown for your booking and ask for the due dates, deposit amount, balance deadline, and accepted payment methods. Do not assume a payment schedule unless it has been clearly communicated and agreed."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "How can I leave a review after an event?",
    "answer": "After the event, use the review option if available and describe your experience fairly, with specific comments about communication, punctuality, performance, and agreed deliverables."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "What should I do if the event venue or schedule changes after confirmation?",
    "answer": "Notify the artist as soon as possible and confirm any revised timings, venue, travel, equipment, and cost implications in writing. Changes may affect availability or the original agreement."
  },
  {
    "category": "General ArtistManch FAQs",
    "question": "How can artists update their profile, portfolio, availability, and pricing?",
    "answer": "Ask for an itemised quote showing the artist fee and any applicable travel, equipment, production, platform, or tax charges. Confirm the final amount and what is included in writing before paying."
  },
  {
    "category": "Celebrity Appearance",
    "question": "How can I book a celebrity for an event through ArtistManch?",
    "answer": "Open the Celebrity Appearance category, compare relevant profiles and samples, then send an enquiry with your date, venue, timings, audience, and budget. Confirm availability, inclusions, total price, and terms with the artist before finalising. For celebrity appearances, availability, appearance format, fee, duration, travel, security, and hospitality needs should be confirmed with the artist or their representative before the booking is finalised."
  },
  {
    "category": "Celebrity Appearance",
    "question": "What details should I provide when requesting a celebrity appearance?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For celebrity appearances, availability, appearance format, fee, duration, travel, security, and hospitality needs should be confirmed with the artist or their representative before the booking is finalised."
  },
  {
    "category": "Celebrity Appearance",
    "question": "How far in advance should I book a celebrity?",
    "answer": "Book as early as practical, especially for popular dates, festivals, wedding seasons, and high-demand performers. The right lead time varies by artist and event complexity, so check availability as soon as your date is known."
  },
  {
    "category": "Celebrity Appearance",
    "question": "What types of appearances can celebrities accept, such as meet-and-greets, launches, or performances?",
    "answer": "Options depend on the artists listed in this category and their individual specialities. Review each profile, portfolio, and description, then mention your preferred style or format in the enquiry. For celebrity appearances, availability, appearance format, fee, duration, travel, security, and hospitality needs should be confirmed with the artist or their representative before the booking is finalised."
  },
  {
    "category": "Celebrity Appearance",
    "question": "Are celebrity appearance fees negotiable based on the event format and duration?",
    "answer": "Pricing can vary with the artist's experience, duration, location, preparation, equipment, team size, and event requirements. Request a written quote with all extra charges listed and confirm what is included before accepting. For celebrity appearances, availability, appearance format, fee, duration, travel, security, and hospitality needs should be confirmed with the artist or their representative before the booking is finalised."
  },
  {
    "category": "Celebrity Appearance",
    "question": "Can I request a virtual appearance or video message?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Celebrity Appearance",
    "question": "What travel, accommodation, and hospitality arrangements are required?",
    "answer": "Discuss arrival time, travel, accommodation if needed, setup, rehearsal, and sound-check requirements in advance. Confirm who arranges and pays for each item in the written quote or booking agreement. For celebrity appearances, availability, appearance format, fee, duration, travel, security, and hospitality needs should be confirmed with the artist or their representative before the booking is finalised."
  },
  {
    "category": "Celebrity Appearance",
    "question": "How is the celebrity's availability confirmed?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Celebrity Appearance",
    "question": "What happens if the celebrity becomes unavailable after a booking is confirmed?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Celebrity Appearance",
    "question": "Can I request a celebrity for a private, corporate, or public event?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For celebrity appearances, availability, appearance format, fee, duration, travel, security, and hospitality needs should be confirmed with the artist or their representative before the booking is finalised."
  },
  {
    "category": "Celebrity Appearance",
    "question": "How are appearance timings, security, and green-room requirements coordinated?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For celebrity appearances, availability, appearance format, fee, duration, travel, security, and hospitality needs should be confirmed with the artist or their representative before the booking is finalised."
  },
  {
    "category": "Celebrity Appearance",
    "question": "How can I verify that a celebrity booking request and confirmation are authentic?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For celebrity appearances, availability, appearance format, fee, duration, travel, security, and hospitality needs should be confirmed with the artist or their representative before the booking is finalised."
  },
  {
    "category": "Dancers & Troupes",
    "question": "How can I book a solo dancer or dance troupe on ArtistManch?",
    "answer": "Open the Dancers & Troupes category, compare relevant profiles and samples, then send an enquiry with your date, venue, timings, audience, and budget. Confirm availability, inclusions, total price, and terms with the artist before finalising. For dance bookings, confirm the dance style, number of performers, set duration, music, stage dimensions, flooring, sound, lighting, costumes, and rehearsal needs in advance."
  },
  {
    "category": "Dancers & Troupes",
    "question": "What dance styles and performance formats are available?",
    "answer": "Options depend on the artists listed in this category and their individual specialities. Review each profile, portfolio, and description, then mention your preferred style or format in the enquiry. For dance bookings, confirm the dance style, number of performers, set duration, music, stage dimensions, flooring, sound, lighting, costumes, and rehearsal needs in advance."
  },
  {
    "category": "Dancers & Troupes",
    "question": "Can I book dancers for weddings, college festivals, corporate events, and stage shows?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For dance bookings, confirm the dance style, number of performers, set duration, music, stage dimensions, flooring, sound, lighting, costumes, and rehearsal needs in advance."
  },
  {
    "category": "Dancers & Troupes",
    "question": "What information should I share about the stage, venue, and audience?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For dance bookings, confirm the dance style, number of performers, set duration, music, stage dimensions, flooring, sound, lighting, costumes, and rehearsal needs in advance."
  },
  {
    "category": "Dancers & Troupes",
    "question": "How many dancers can be included in a troupe booking?",
    "answer": "The available team size or combined package depends on the artist's offering and schedule. Specify how many performers or services you need, how they should coordinate, and whether they share a stage or timeline; request an itemised quote. For dance bookings, confirm the dance style, number of performers, set duration, music, stage dimensions, flooring, sound, lighting, costumes, and rehearsal needs in advance."
  },
  {
    "category": "Dancers & Troupes",
    "question": "Can a troupe create a customised routine for a song, theme, or brand?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For dance bookings, confirm the dance style, number of performers, set duration, music, stage dimensions, flooring, sound, lighting, costumes, and rehearsal needs in advance."
  },
  {
    "category": "Dancers & Troupes",
    "question": "How long is a typical dance performance, and can I request multiple sets?",
    "answer": "Performance or service duration varies by artist and package. Agree on start time, end time, breaks, setup, sound check, overtime rate, and what happens if the event runs late before confirming. For dance bookings, confirm the dance style, number of performers, set duration, music, stage dimensions, flooring, sound, lighting, costumes, and rehearsal needs in advance."
  },
  {
    "category": "Dancers & Troupes",
    "question": "What sound, lighting, flooring, and backstage facilities are required?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For dance bookings, confirm the dance style, number of performers, set duration, music, stage dimensions, flooring, sound, lighting, costumes, and rehearsal needs in advance."
  },
  {
    "category": "Dancers & Troupes",
    "question": "Can I request an audition video or past performance clips before booking?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Dancers & Troupes",
    "question": "How are rehearsal time and sound checks arranged?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For dance bookings, confirm the dance style, number of performers, set duration, music, stage dimensions, flooring, sound, lighting, costumes, and rehearsal needs in advance."
  },
  {
    "category": "Dancers & Troupes",
    "question": "Can dancers accommodate last-minute changes to the event schedule?",
    "answer": "Contact the artist immediately and explain the change. Any fee, refund, replacement, or rescheduling option depends on the agreed booking terms and the artist's availability, so document the updated arrangement in writing."
  },
  {
    "category": "Dancers & Troupes",
    "question": "How are costume, travel, and additional production costs handled?",
    "answer": "Pricing can vary with the artist's experience, duration, location, preparation, equipment, team size, and event requirements. Request a written quote with all extra charges listed and confirm what is included before accepting. For dance bookings, confirm the dance style, number of performers, set duration, music, stage dimensions, flooring, sound, lighting, costumes, and rehearsal needs in advance."
  },
  {
    "category": "Instrumentalist",
    "question": "Which instruments and performance styles can I book through ArtistManch?",
    "answer": "Options depend on the artists listed in this category and their individual specialities. Review each profile, portfolio, and description, then mention your preferred style or format in the enquiry. For instrumental performances, confirm the instrument, repertoire, number of sets, whether amplification is needed, and which instruments or audio equipment the performer will bring."
  },
  {
    "category": "Instrumentalist",
    "question": "Can I book a solo instrumentalist, a duo, or a small ensemble?",
    "answer": "Suitability depends on the profiles and clients active on the platform. Present your experience honestly, upload strong samples, state your preferred event types and budget range, and consider smaller events or shorter sets when building a portfolio."
  },
  {
    "category": "Instrumentalist",
    "question": "Are instrumentalists available for weddings, receptions, private parties, and corporate events?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Instrumentalist",
    "question": "Can I request a specific song, genre, or customised setlist?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For instrumental performances, confirm the instrument, repertoire, number of sets, whether amplification is needed, and which instruments or audio equipment the performer will bring."
  },
  {
    "category": "Instrumentalist",
    "question": "Do instrumentalists provide their own instruments and equipment?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For instrumental performances, confirm the instrument, repertoire, number of sets, whether amplification is needed, and which instruments or audio equipment the performer will bring."
  },
  {
    "category": "Instrumentalist",
    "question": "What audio equipment, microphones, and stage setup are required?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For instrumental performances, confirm the instrument, repertoire, number of sets, whether amplification is needed, and which instruments or audio equipment the performer will bring."
  },
  {
    "category": "Instrumentalist",
    "question": "Can an instrumentalist perform alongside a singer or DJ?",
    "answer": "The available team size or combined package depends on the artist's offering and schedule. Specify how many performers or services you need, how they should coordinate, and whether they share a stage or timeline; request an itemised quote. For instrumental performances, confirm the instrument, repertoire, number of sets, whether amplification is needed, and which instruments or audio equipment the performer will bring."
  },
  {
    "category": "Instrumentalist",
    "question": "How long are instrumental sets, and can breaks be customised?",
    "answer": "Performance or service duration varies by artist and package. Agree on start time, end time, breaks, setup, sound check, overtime rate, and what happens if the event runs late before confirming. For instrumental performances, confirm the instrument, repertoire, number of sets, whether amplification is needed, and which instruments or audio equipment the performer will bring."
  },
  {
    "category": "Instrumentalist",
    "question": "Can I listen to sample recordings or watch performance videos before booking?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Instrumentalist",
    "question": "Are acoustic and unplugged performances available?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Instrumentalist",
    "question": "How are travel, setup, and sound-check requirements coordinated?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For instrumental performances, confirm the instrument, repertoire, number of sets, whether amplification is needed, and which instruments or audio equipment the performer will bring."
  },
  {
    "category": "Instrumentalist",
    "question": "What happens if an instrument or essential equipment fails during the event?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For instrumental performances, confirm the instrument, repertoire, number of sets, whether amplification is needed, and which instruments or audio equipment the performer will bring."
  },
  {
    "category": "Magician",
    "question": "What types of magic performances can I book through ArtistManch?",
    "answer": "Options depend on the artists listed in this category and their individual specialities. Review each profile, portfolio, and description, then mention your preferred style or format in the enquiry. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Magician",
    "question": "Can I book close-up magic, stage illusions, mentalism, or a children's magic show?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Magician",
    "question": "Which age groups and audience sizes are suitable for each type of performance?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Magician",
    "question": "Can the magician customise tricks around a wedding, birthday, or corporate theme?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Magician",
    "question": "How much space and preparation time does a magic show require?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Magician",
    "question": "Does the magician bring all props and performance equipment?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Magician",
    "question": "Can the magician perform table-to-table magic during a dinner or reception?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Magician",
    "question": "How long does a typical magic performance last?",
    "answer": "Performance or service duration varies by artist and package. Agree on start time, end time, breaks, setup, sound check, overtime rate, and what happens if the event runs late before confirming. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Magician",
    "question": "Can I request a demonstration video or references before booking?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Magician",
    "question": "Are audience participation and volunteer segments included?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Magician",
    "question": "Are there any venue, safety, or accessibility requirements?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Magician",
    "question": "Can the performance be adapted for an outdoor event?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For magic acts, choose the format and audience type first, then confirm the available space, show length, audience participation, props, and any safety or venue restrictions."
  },
  {
    "category": "Photographer/Videographer",
    "question": "How can I choose the right photographer or videographer for my event?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Photographer/Videographer",
    "question": "Do you offer event photography, candid photography, portraits, reels, and cinematic films?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For photography and videography, agree on coverage hours, deliverables, editing style, delivery timeline, usage rights, extra-hour rates, and any venue permissions before the shoot."
  },
  {
    "category": "Photographer/Videographer",
    "question": "Can I book photography and videography together?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Photographer/Videographer",
    "question": "How many hours of coverage are included in a typical booking?",
    "answer": "The available team size or combined package depends on the artist's offering and schedule. Specify how many performers or services you need, how they should coordinate, and whether they share a stage or timeline; request an itemised quote. For photography and videography, agree on coverage hours, deliverables, editing style, delivery timeline, usage rights, extra-hour rates, and any venue permissions before the shoot."
  },
  {
    "category": "Photographer/Videographer",
    "question": "How many edited photos or videos will I receive, and when will they be delivered?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Photographer/Videographer",
    "question": "Can I request a specific editing style, shot list, or visual reference?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For photography and videography, agree on coverage hours, deliverables, editing style, delivery timeline, usage rights, extra-hour rates, and any venue permissions before the shoot."
  },
  {
    "category": "Photographer/Videographer",
    "question": "Are raw photos and unedited footage available on request?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Photographer/Videographer",
    "question": "Does the package include albums, highlight films, reels, or drone coverage?",
    "answer": "Requirements depend on the venue, activity, and local rules. Confirm permits, venue approval, weather contingencies, insurance where applicable, and safety measures before the event; do not proceed if the venue cannot meet the artist's safety requirements. For photography and videography, agree on coverage hours, deliverables, editing style, delivery timeline, usage rights, extra-hour rates, and any venue permissions before the shoot."
  },
  {
    "category": "Photographer/Videographer",
    "question": "What permissions or venue restrictions apply to drone photography?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For photography and videography, agree on coverage hours, deliverables, editing style, delivery timeline, usage rights, extra-hour rates, and any venue permissions before the shoot."
  },
  {
    "category": "Photographer/Videographer",
    "question": "How are extra hours, additional photographers, and travel expenses charged?",
    "answer": "Pricing can vary with the artist's experience, duration, location, preparation, equipment, team size, and event requirements. Request a written quote with all extra charges listed and confirm what is included before accepting. For photography and videography, agree on coverage hours, deliverables, editing style, delivery timeline, usage rights, extra-hour rates, and any venue permissions before the shoot."
  },
  {
    "category": "Photographer/Videographer",
    "question": "How are photos and videos delivered, stored, and shared securely?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Photographer/Videographer",
    "question": "What happens if the assigned photographer or videographer cannot attend?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Comedian",
    "question": "What kinds of comedy acts can I book through ArtistManch?",
    "answer": "Options depend on the artists listed in this category and their individual specialities. Review each profile, portfolio, and description, then mention your preferred style or format in the enquiry. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "Can I book stand-up comedy, improv, clean comedy, or a host-comedian?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "How can I ensure the comedian's material is appropriate for my audience?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "Can the set be customised for a corporate event, wedding, or college show?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "Can I request a clean or family-friendly performance?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "How long is a standard comedy set, and can I book multiple sets?",
    "answer": "Performance or service duration varies by artist and package. Agree on start time, end time, breaks, setup, sound check, overtime rate, and what happens if the event runs late before confirming. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "Can the comedian include audience interaction or improvisation?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "What stage, microphone, lighting, and sound setup is required?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "Can I review performance clips or audience feedback before booking?",
    "answer": "Pricing can vary with the artist's experience, duration, location, preparation, equipment, team size, and event requirements. Request a written quote with all extra charges listed and confirm what is included before accepting. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "Can the comedian perform in a particular language or regional style?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "How are travel, accommodation, and technical requirements handled?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For comedy bookings, confirm the style, language, audience suitability, content boundaries, set length, microphone and sound requirements, and any event-specific customisation."
  },
  {
    "category": "Comedian",
    "question": "What happens if the event schedule changes or the show needs to be rescheduled?",
    "answer": "Contact the artist immediately and explain the change. Any fee, refund, replacement, or rescheduling option depends on the agreed booking terms and the artist's availability, so document the updated arrangement in writing."
  },
  {
    "category": "Model",
    "question": "How can I book a model for a campaign, fashion show, or promotional event?",
    "answer": "Open the Model category, compare relevant profiles and samples, then send an enquiry with your date, venue, timings, audience, and budget. Confirm availability, inclusions, total price, and terms with the artist before finalising. For model bookings, agree on the brief, shoot or event timings, wardrobe, fitting needs, usage rights, exclusivity, location, and overtime terms before confirming."
  },
  {
    "category": "Model",
    "question": "What types of models are available, including fashion, commercial, catalogue, and promotional models?",
    "answer": "Options depend on the artists listed in this category and their individual specialities. Review each profile, portfolio, and description, then mention your preferred style or format in the enquiry. For model bookings, agree on the brief, shoot or event timings, wardrobe, fitting needs, usage rights, exclusivity, location, and overtime terms before confirming."
  },
  {
    "category": "Model",
    "question": "Can I filter models by experience, portfolio, location, or specialisation?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Model",
    "question": "How do I review a model's portfolio and previous work?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Model",
    "question": "Can I request a casting call or audition before confirming a booking?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For model bookings, agree on the brief, shoot or event timings, wardrobe, fitting needs, usage rights, exclusivity, location, and overtime terms before confirming."
  },
  {
    "category": "Model",
    "question": "What information should I provide about the concept, wardrobe, and shoot location?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For model bookings, agree on the brief, shoot or event timings, wardrobe, fitting needs, usage rights, exclusivity, location, and overtime terms before confirming."
  },
  {
    "category": "Model",
    "question": "Are fitting sessions, rehearsals, and travel time included in the booking?",
    "answer": "Discuss arrival time, travel, accommodation if needed, setup, rehearsal, and sound-check requirements in advance. Confirm who arranges and pays for each item in the written quote or booking agreement. For model bookings, agree on the brief, shoot or event timings, wardrobe, fitting needs, usage rights, exclusivity, location, and overtime terms before confirming."
  },
  {
    "category": "Model",
    "question": "How are usage rights for campaign photos and videos agreed upon?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Model",
    "question": "Can a model work with a specific photographer, designer, or production team?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For model bookings, agree on the brief, shoot or event timings, wardrobe, fitting needs, usage rights, exclusivity, location, and overtime terms before confirming."
  },
  {
    "category": "Model",
    "question": "How are overtime and additional shoot hours charged?",
    "answer": "Pricing can vary with the artist's experience, duration, location, preparation, equipment, team size, and event requirements. Request a written quote with all extra charges listed and confirm what is included before accepting. For model bookings, agree on the brief, shoot or event timings, wardrobe, fitting needs, usage rights, exclusivity, location, and overtime terms before confirming."
  },
  {
    "category": "Model",
    "question": "What arrangements are needed for changing rooms, styling, and on-set safety?",
    "answer": "Requirements depend on the venue, activity, and local rules. Confirm permits, venue approval, weather contingencies, insurance where applicable, and safety measures before the event; do not proceed if the venue cannot meet the artist's safety requirements. For model bookings, agree on the brief, shoot or event timings, wardrobe, fitting needs, usage rights, exclusivity, location, and overtime terms before confirming."
  },
  {
    "category": "Model",
    "question": "What happens if a model is unavailable on the confirmed date?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Emcee/Anchor",
    "question": "How can I book an emcee or anchor for my event?",
    "answer": "Open the Emcee/Anchor category, compare relevant profiles and samples, then send an enquiry with your date, venue, timings, audience, and budget. Confirm availability, inclusions, total price, and terms with the artist before finalising. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "Can I find anchors for weddings, award ceremonies, conferences, and college festivals?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "Can the emcee host in English, Hindi, or a regional language?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "Can the script be customised to match my event agenda, brand, or theme?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "Can I share pronunciation notes, guest details, and key announcements in advance?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "How much preparation time does the emcee need?",
    "answer": "Discuss arrival time, travel, accommodation if needed, setup, rehearsal, and sound-check requirements in advance. Confirm who arranges and pays for each item in the written quote or booking agreement. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "Can the emcee coordinate games, audience interactions, and award presentations?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "Will the emcee attend a briefing or rehearsal before the event?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "What microphone, stage, confidence monitor, or cueing setup is required?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "Can I book a bilingual or co-hosting pair?",
    "answer": "The available team size or combined package depends on the artist's offering and schedule. Specify how many performers or services you need, how they should coordinate, and whether they share a stage or timeline; request an itemised quote. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "How are extra hours and schedule delays handled?",
    "answer": "Performance or service duration varies by artist and package. Agree on start time, end time, breaks, setup, sound check, overtime rate, and what happens if the event runs late before confirming. For emcee bookings, share the event agenda, names and pronunciations, key announcements, preferred language, tone, timing, and any rehearsal or briefing requirements."
  },
  {
    "category": "Emcee/Anchor",
    "question": "Can I review a showreel or hosting samples before confirming?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "DJ",
    "question": "How can I book a DJ for a wedding, party, club night, or corporate event?",
    "answer": "Open the DJ category, compare relevant profiles and samples, then send an enquiry with your date, venue, timings, audience, and budget. Confirm availability, inclusions, total price, and terms with the artist before finalising. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "DJ",
    "question": "Can I choose a DJ based on genre, language, and preferred music style?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "DJ",
    "question": "Can I share a must-play list and a do-not-play list?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "DJ",
    "question": "Does the DJ provide speakers, mixers, controllers, and lighting?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "DJ",
    "question": "Can I book a DJ with a live instrumentalist, singer, or percussionist?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "DJ",
    "question": "How long is a standard DJ set, and can the performance be extended?",
    "answer": "Performance or service duration varies by artist and package. Agree on start time, end time, breaks, setup, sound check, overtime rate, and what happens if the event runs late before confirming. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "DJ",
    "question": "What venue size and sound requirements should I consider?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "DJ",
    "question": "Can the DJ make announcements or coordinate with the event host?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "DJ",
    "question": "Are special mixes, entrance tracks, or customised edits available?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "DJ",
    "question": "How are sound restrictions and venue noise limits handled?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "DJ",
    "question": "What are the setup, sound-check, and power requirements?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "DJ",
    "question": "How are extra equipment, travel, and overtime charges communicated?",
    "answer": "Pricing can vary with the artist's experience, duration, location, preparation, equipment, team size, and event requirements. Request a written quote with all extra charges listed and confirm what is included before accepting. For DJ bookings, confirm genres, must-play and do-not-play requests, set duration, sound and lighting equipment, venue restrictions, setup time, and any extra equipment charges."
  },
  {
    "category": "Live Bands",
    "question": "What types of live bands can I book through ArtistManch?",
    "answer": "Options depend on the artists listed in this category and their individual specialities. Review each profile, portfolio, and description, then mention your preferred style or format in the enquiry. For live bands, confirm the lineup, setlist, set duration, stage and power requirements, sound/backline arrangements, technical rider, and travel or accommodation needs."
  },
  {
    "category": "Live Bands",
    "question": "Can I book bands for weddings, festivals, private parties, and corporate events?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For live bands, confirm the lineup, setlist, set duration, stage and power requirements, sound/backline arrangements, technical rider, and travel or accommodation needs."
  },
  {
    "category": "Live Bands",
    "question": "Can I choose a band based on genre, language, or acoustic/electric setup?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For live bands, confirm the lineup, setlist, set duration, stage and power requirements, sound/backline arrangements, technical rider, and travel or accommodation needs."
  },
  {
    "category": "Live Bands",
    "question": "Can the band perform a customised setlist or special-request songs?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For live bands, confirm the lineup, setlist, set duration, stage and power requirements, sound/backline arrangements, technical rider, and travel or accommodation needs."
  },
  {
    "category": "Live Bands",
    "question": "How many musicians and vocalists are included in the booking?",
    "answer": "The available team size or combined package depends on the artist's offering and schedule. Specify how many performers or services you need, how they should coordinate, and whether they share a stage or timeline; request an itemised quote. For live bands, confirm the lineup, setlist, set duration, stage and power requirements, sound/backline arrangements, technical rider, and travel or accommodation needs."
  },
  {
    "category": "Live Bands",
    "question": "Does the band provide its own sound system, instruments, and backline equipment?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For live bands, confirm the lineup, setlist, set duration, stage and power requirements, sound/backline arrangements, technical rider, and travel or accommodation needs."
  },
  {
    "category": "Live Bands",
    "question": "What stage size, power supply, lighting, and sound setup are required?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For live bands, confirm the lineup, setlist, set duration, stage and power requirements, sound/backline arrangements, technical rider, and travel or accommodation needs."
  },
  {
    "category": "Live Bands",
    "question": "Can I request demo recordings, live videos, or a sample setlist?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Live Bands",
    "question": "How long are the performance sets, and how are breaks scheduled?",
    "answer": "Performance or service duration varies by artist and package. Agree on start time, end time, breaks, setup, sound check, overtime rate, and what happens if the event runs late before confirming. For live bands, confirm the lineup, setlist, set duration, stage and power requirements, sound/backline arrangements, technical rider, and travel or accommodation needs."
  },
  {
    "category": "Live Bands",
    "question": "Can the band collaborate with a DJ or guest performer?",
    "answer": "The available team size or combined package depends on the artist's offering and schedule. Specify how many performers or services you need, how they should coordinate, and whether they share a stage or timeline; request an itemised quote. For live bands, confirm the lineup, setlist, set duration, stage and power requirements, sound/backline arrangements, technical rider, and travel or accommodation needs."
  },
  {
    "category": "Live Bands",
    "question": "How are travel, accommodation, setup, and technical riders managed?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For live bands, confirm the lineup, setlist, set duration, stage and power requirements, sound/backline arrangements, technical rider, and travel or accommodation needs."
  },
  {
    "category": "Live Bands",
    "question": "What backup arrangements are available if a band member is unable to attend?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "What makeup and styling services can I book through ArtistManch?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For makeup and styling, agree on the look, number of people, start time, trial session, products, hairstyle or draping needs, touch-ups, workspace, and travel costs."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "Can I book bridal makeup, party makeup, editorial looks, hairstyling, or grooming?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For makeup and styling, agree on the look, number of people, start time, trial session, products, hairstyle or draping needs, touch-ups, workspace, and travel costs."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "How can I choose an artist based on their portfolio and preferred style?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "Are trial sessions available before the event?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "What products, tools, and hygiene practices does the artist follow?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For makeup and styling, agree on the look, number of people, start time, trial session, products, hairstyle or draping needs, touch-ups, workspace, and travel costs."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "How much time should I allocate for makeup and hairstyling?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For makeup and styling, agree on the look, number of people, start time, trial session, products, hairstyle or draping needs, touch-ups, workspace, and travel costs."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "Can the artist accommodate multiple people at the same venue?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For makeup and styling, agree on the look, number of people, start time, trial session, products, hairstyle or draping needs, touch-ups, workspace, and travel costs."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "Can I request a specific look, reference image, or theme?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For makeup and styling, agree on the look, number of people, start time, trial session, products, hairstyle or draping needs, touch-ups, workspace, and travel costs."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "Are outfit styling, draping, accessories, and touch-ups included?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For makeup and styling, agree on the look, number of people, start time, trial session, products, hairstyle or draping needs, touch-ups, workspace, and travel costs."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "What lighting, seating, mirror, and workspace should the client provide?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For makeup and styling, agree on the look, number of people, start time, trial session, products, hairstyle or draping needs, touch-ups, workspace, and travel costs."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "How are travel fees, early-morning bookings, and extra looks charged?",
    "answer": "Pricing can vary with the artist's experience, duration, location, preparation, equipment, team size, and event requirements. Request a written quote with all extra charges listed and confirm what is included before accepting. For makeup and styling, agree on the look, number of people, start time, trial session, products, hairstyle or draping needs, touch-ups, workspace, and travel costs."
  },
  {
    "category": "Makeup Artists & Stylists",
    "question": "What is the cancellation or rescheduling process for makeup and styling bookings?",
    "answer": "Contact the artist immediately and explain the change. Any fee, refund, replacement, or rescheduling option depends on the agreed booking terms and the artist's availability, so document the updated arrangement in writing."
  },
  {
    "category": "Singer",
    "question": "What types of singers can I book through ArtistManch?",
    "answer": "Options depend on the artists listed in this category and their individual specialities. Review each profile, portfolio, and description, then mention your preferred style or format in the enquiry. For singer bookings, confirm genre, language, requested songs, set length, backing tracks or live accompaniment, microphone and monitor requirements, and sound-check timing."
  },
  {
    "category": "Singer",
    "question": "Can I book solo singers, duos, vocal ensembles, or playback-style performers?",
    "answer": "Suitability depends on the profiles and clients active on the platform. Present your experience honestly, upload strong samples, state your preferred event types and budget range, and consider smaller events or shorter sets when building a portfolio."
  },
  {
    "category": "Singer",
    "question": "Are singers available for weddings, receptions, private events, and corporate functions?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Singer",
    "question": "Can I request songs in specific languages or genres?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For singer bookings, confirm genre, language, requested songs, set length, backing tracks or live accompaniment, microphone and monitor requirements, and sound-check timing."
  },
  {
    "category": "Singer",
    "question": "Can the singer prepare a special dedication or customised setlist?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For singer bookings, confirm genre, language, requested songs, set length, backing tracks or live accompaniment, microphone and monitor requirements, and sound-check timing."
  },
  {
    "category": "Singer",
    "question": "Does the singer perform with a backing track, band, or live accompanist?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For singer bookings, confirm genre, language, requested songs, set length, backing tracks or live accompaniment, microphone and monitor requirements, and sound-check timing."
  },
  {
    "category": "Singer",
    "question": "What microphones, monitors, and audio equipment are required?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For singer bookings, confirm genre, language, requested songs, set length, backing tracks or live accompaniment, microphone and monitor requirements, and sound-check timing."
  },
  {
    "category": "Singer",
    "question": "Can I watch live performance clips or listen to recordings before booking?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Singer",
    "question": "How long is a typical singing performance, and can I request multiple sets?",
    "answer": "Performance or service duration varies by artist and package. Agree on start time, end time, breaks, setup, sound check, overtime rate, and what happens if the event runs late before confirming. For singer bookings, confirm genre, language, requested songs, set length, backing tracks or live accompaniment, microphone and monitor requirements, and sound-check timing."
  },
  {
    "category": "Singer",
    "question": "Can the singer perform with a DJ or instrumentalist?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For singer bookings, confirm genre, language, requested songs, set length, backing tracks or live accompaniment, microphone and monitor requirements, and sound-check timing."
  },
  {
    "category": "Singer",
    "question": "How are song requests, sound checks, and rehearsals coordinated?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For singer bookings, confirm genre, language, requested songs, set length, backing tracks or live accompaniment, microphone and monitor requirements, and sound-check timing."
  },
  {
    "category": "Singer",
    "question": "What happens if the event runs late or the performance needs to be rescheduled?",
    "answer": "Contact the artist immediately and explain the change. Any fee, refund, replacement, or rescheduling option depends on the agreed booking terms and the artist's availability, so document the updated arrangement in writing."
  },
  {
    "category": "Speaker",
    "question": "What types of speakers can I book for my event?",
    "answer": "Options depend on the artists listed in this category and their individual specialities. Review each profile, portfolio, and description, then mention your preferred style or format in the enquiry. For speakers, agree on the topic, audience, session length, format, learning goals, presentation materials, AV setup, Q&A, travel, and any preparation call."
  },
  {
    "category": "Speaker",
    "question": "Can I find keynote speakers, industry experts, trainers, motivational speakers, or panelists?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For speakers, agree on the topic, audience, session length, format, learning goals, presentation materials, AV setup, Q&A, travel, and any preparation call."
  },
  {
    "category": "Speaker",
    "question": "How can I evaluate a speaker's expertise and suitability for my audience?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For speakers, agree on the topic, audience, session length, format, learning goals, presentation materials, AV setup, Q&A, travel, and any preparation call."
  },
  {
    "category": "Speaker",
    "question": "Can the speaker tailor the presentation to my event goals and audience level?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For speakers, agree on the topic, audience, session length, format, learning goals, presentation materials, AV setup, Q&A, travel, and any preparation call."
  },
  {
    "category": "Speaker",
    "question": "Can I request a specific topic, presentation format, or learning outcome?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For speakers, agree on the topic, audience, session length, format, learning goals, presentation materials, AV setup, Q&A, travel, and any preparation call."
  },
  {
    "category": "Speaker",
    "question": "Are virtual and hybrid speaking sessions available?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Speaker",
    "question": "How long are keynote talks, workshops, and Q&A sessions?",
    "answer": "Performance or service duration varies by artist and package. Agree on start time, end time, breaks, setup, sound check, overtime rate, and what happens if the event runs late before confirming. For speakers, agree on the topic, audience, session length, format, learning goals, presentation materials, AV setup, Q&A, travel, and any preparation call."
  },
  {
    "category": "Speaker",
    "question": "Can the speaker participate in a panel discussion or audience Q&A?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For speakers, agree on the topic, audience, session length, format, learning goals, presentation materials, AV setup, Q&A, travel, and any preparation call."
  },
  {
    "category": "Speaker",
    "question": "What AV equipment, presentation facilities, and accessibility support are needed?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For speakers, agree on the topic, audience, session length, format, learning goals, presentation materials, AV setup, Q&A, travel, and any preparation call."
  },
  {
    "category": "Speaker",
    "question": "Can I review previous talks, credentials, or testimonials before booking?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Speaker",
    "question": "Are presentation materials or post-event resources included?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For speakers, agree on the topic, audience, session length, format, learning goals, presentation materials, AV setup, Q&A, travel, and any preparation call."
  },
  {
    "category": "Speaker",
    "question": "How are travel, accommodation, preparation calls, and schedule changes handled?",
    "answer": "Discuss arrival time, travel, accommodation if needed, setup, rehearsal, and sound-check requirements in advance. Confirm who arranges and pays for each item in the written quote or booking agreement. For speakers, agree on the topic, audience, session length, format, learning goals, presentation materials, AV setup, Q&A, travel, and any preparation call."
  },
  {
    "category": "Variety Artist",
    "question": "What kinds of variety acts can I discover on ArtistManch?",
    "answer": "Options depend on the artists listed in this category and their individual specialities. Review each profile, portfolio, and description, then mention your preferred style or format in the enquiry. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "Can I book jugglers, fire performers, aerial acts, mime artists, stilt walkers, or speciality performers?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "Which acts are suitable for children, family audiences, or formal corporate events?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "Can a variety act be customised to match my event theme?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "What venue dimensions, ceiling height, flooring, and rigging are required?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "Are specialist equipment and props provided by the artist?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "What safety measures and permissions are needed for fire or aerial performances?",
    "answer": "Requirements depend on the venue, activity, and local rules. Confirm permits, venue approval, weather contingencies, insurance where applicable, and safety measures before the event; do not proceed if the venue cannot meet the artist's safety requirements. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "Can I book roaming entertainment as well as a scheduled stage act?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "How long is each performance, and can multiple sets be arranged?",
    "answer": "Performance or service duration varies by artist and package. Agree on start time, end time, breaks, setup, sound check, overtime rate, and what happens if the event runs late before confirming. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "Can I request a demo video and technical rider before booking?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "What weather, power, or venue restrictions might affect an outdoor act?",
    "answer": "Requirements depend on the act and venue. Ask the artist for a written technical rider covering space, power, sound, lighting, equipment, access, setup, and sound-check time, then confirm which items the venue or client must supply. For variety acts, confirm the exact act, audience suitability, performance area, ceiling height or rigging, equipment, safety requirements, weather constraints, and venue permissions."
  },
  {
    "category": "Variety Artist",
    "question": "What backup plan is available if the act cannot safely perform at the venue?",
    "answer": "Ask the artist to confirm the exact date, call time, performance window, and location in writing. If availability changes, discuss suitable replacements, rescheduling, or cancellation under the agreed booking terms as soon as possible."
  },
  {
    "category": "Influencer",
    "question": "How can I book an influencer for a brand campaign or event appearance?",
    "answer": "Open the Influencer category, compare relevant profiles and samples, then send an enquiry with your date, venue, timings, audience, and budget. Confirm availability, inclusions, total price, and terms with the artist before finalising. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  },
  {
    "category": "Influencer",
    "question": "Can I find influencers by niche, platform, audience location, or content format?",
    "answer": "Include the preferred language, genre, audience age range, event tone, and any content boundaries in your enquiry. Ask the artist to confirm suitability for your audience before booking. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  },
  {
    "category": "Influencer",
    "question": "What campaign deliverables can be requested, such as reels, stories, posts, or event coverage?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  },
  {
    "category": "Influencer",
    "question": "How can I assess whether an influencer's audience aligns with my target customers?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  },
  {
    "category": "Influencer",
    "question": "Can I review audience insights, engagement, and previous campaign examples?",
    "answer": "Review the portfolio and samples shown on the profile, and request recent examples relevant to your event if needed. Check that the examples reflect the style, audience, language, and scale you are looking for."
  },
  {
    "category": "Influencer",
    "question": "Can the influencer create content based on a brand brief and campaign guidelines?",
    "answer": "Share your references, theme, must-haves, restrictions, and deadline as early as possible. The artist can confirm what is feasible, whether preparation or rehearsal fees apply, and any limitations before accepting the request. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  },
  {
    "category": "Influencer",
    "question": "Who approves the content, and how many revision rounds are included?",
    "answer": "List the required deliverables, format, deadlines, usage period, platforms, crediting, exclusivity, and any raw-file or reporting needs in writing. Confirm who owns the content and what reuse or advertising rights are included before work begins. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  },
  {
    "category": "Influencer",
    "question": "How are posting dates, event attendance, and campaign deadlines agreed upon?",
    "answer": "Requirements vary by artist, event, and venue. Share your event details and expectations in the enquiry, then confirm availability, inclusions, responsibilities, total price, and any special conditions in writing before proceeding. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  },
  {
    "category": "Influencer",
    "question": "What usage rights, exclusivity, and paid-ad permissions should be discussed?",
    "answer": "Requirements depend on the venue, activity, and local rules. Confirm permits, venue approval, weather contingencies, insurance where applicable, and safety measures before the event; do not proceed if the venue cannot meet the artist's safety requirements. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  },
  {
    "category": "Influencer",
    "question": "How are sponsored content disclosures and platform policies handled?",
    "answer": "List the required deliverables, format, deadlines, usage period, platforms, crediting, exclusivity, and any raw-file or reporting needs in writing. Confirm who owns the content and what reuse or advertising rights are included before work begins. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  },
  {
    "category": "Influencer",
    "question": "Can I book a bundle across multiple social platforms?",
    "answer": "The available team size or combined package depends on the artist's offering and schedule. Specify how many performers or services you need, how they should coordinate, and whether they share a stage or timeline; request an itemised quote. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  },
  {
    "category": "Influencer",
    "question": "How are campaign performance metrics and post-campaign reports shared?",
    "answer": "List the required deliverables, format, deadlines, usage period, platforms, crediting, exclusivity, and any raw-file or reporting needs in writing. Confirm who owns the content and what reuse or advertising rights are included before work begins. For influencer campaigns, document the platform, audience fit, deliverables, content brief, deadlines, approval process, usage rights, exclusivity, disclosures, and reporting expectations."
  }
];
