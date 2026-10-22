// Established works in second-language acquisition, task-based learning and
// game-based learning that provide theoretical background for this project.
// Reconcile this list with the reference list of the final written paper.

export interface Reference {
  text: string
  topic: 'Speaking & SLA' | 'Learning theory' | 'Task-based learning' | 'Games & learning' | 'Research methods' | 'Assessment'
}

export const referencesNote =
  'Background literature for the theoretical framework. The final written paper’s reference list is the authoritative version.'

export const references: Reference[] = [
  {
    topic: 'Research methods',
    text: 'Campbell, D. T., & Stanley, J. C. (1963). Experimental and quasi-experimental designs for research. Rand McNally.',
  },
  {
    topic: 'Assessment',
    text: 'Council of Europe. (2020). Common European Framework of Reference for Languages: Learning, teaching, assessment – Companion volume. Council of Europe Publishing.',
  },
  {
    topic: 'Research methods',
    text: 'Dörnyei, Z. (2007). Research methods in applied linguistics. Oxford University Press.',
  },
  {
    topic: 'Task-based learning',
    text: 'Ellis, R. (2003). Task-based language learning and teaching. Oxford University Press.',
  },
  {
    topic: 'Games & learning',
    text: 'Gee, J. P. (2003). What video games have to teach us about learning and literacy. Palgrave Macmillan.',
  },
  {
    topic: 'Speaking & SLA',
    text: 'Horwitz, E. K., Horwitz, M. B., & Cope, J. (1986). Foreign language classroom anxiety. The Modern Language Journal, 70(2), 125–132.',
  },
  {
    topic: 'Speaking & SLA',
    text: 'Krashen, S. D. (1982). Principles and practice in second language acquisition. Pergamon Press.',
  },
  {
    topic: 'Speaking & SLA',
    text: 'Long, M. H. (1996). The role of the linguistic environment in second language acquisition. In W. C. Ritchie & T. K. Bhatia (Eds.), Handbook of second language acquisition (pp. 413–468). Academic Press.',
  },
  {
    topic: 'Games & learning',
    text: 'Peterson, M. (2013). Computer games and language learning. Palgrave Macmillan.',
  },
  {
    topic: 'Games & learning',
    text: 'Reinhardt, J. (2019). Gameful second and foreign language teaching and learning: Theory, research, and practice. Palgrave Macmillan.',
  },
  {
    topic: 'Speaking & SLA',
    text: 'Swain, M. (1985). Communicative competence: Some roles of comprehensible input and comprehensible output in its development. In S. M. Gass & C. G. Madden (Eds.), Input in second language acquisition (pp. 235–253). Newbury House.',
  },
  {
    topic: 'Games & learning',
    text: 'Sykes, J. M., & Reinhardt, J. (2013). Language at play: Digital games in second and foreign language teaching and learning. Pearson.',
  },
  {
    topic: 'Speaking & SLA',
    text: 'Thornbury, S. (2005). How to teach speaking. Longman.',
  },
  {
    topic: 'Learning theory',
    text: 'Vygotsky, L. S. (1978). Mind in society: The development of higher psychological processes. Harvard University Press.',
  },
  {
    topic: 'Task-based learning',
    text: 'Willis, J. (1996). A framework for task-based learning. Longman.',
  },
]
