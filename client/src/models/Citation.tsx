/**
 * Citation object from the OpenCitations API
 * @example
  {
    "timespan": "P1Y2M21D",
    "oci": "061202325243-062403150807",
    "journal_sc": "no",
    "cited": "omid:br/062403150807 doi:10.1145/3452383.3452391 openalex:W3159497091",
    "creation": "2022-05-16",
    "author_sc": "no",
    "citing": "omid:br/061202325243 doi:10.1145/3535511.3535541 openalex:W4283735155"
  },
 */
export interface Citation {
	timespan: string;
	oci: string;
	journal_sc: string;
	cited: string;
	creation: Date;
	author_sc: string;
	citing: string;
}
