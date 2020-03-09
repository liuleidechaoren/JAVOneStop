import React, { useState }  from 'react';
import Spinner from 'react-bootstrap/Spinner'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { useTranslation } from 'react-i18next';

const JavSetSearchGroup = ({ jav_set_name, source_site, setSourceSite, 
    setJavSet, setSearchString, setJavObjs, setMaxPage, setPageNum, 
    jav_stat_filter, setJavStatFilter }) => {
    const { t, i18n } = useTranslation();
    const [isLoading, setLoading] = useState(false);

    const website_set_map = {
        'javlib_browser': ['most_wanted', 'best_rated', 'trending_updates', 'personal_wanted'],
        'javbus_browser': ['subtitled', 'trending_updates']
    }
    const [set_toggle_list, setToggleList] = useState(website_set_map[source_site]);

    let current_filter = undefined;
    if (jav_stat_filter.length === 0) {
        current_filter = 'no_filter';
    } else if (JSON.stringify(jav_stat_filter) === "[0,2]") {
        current_filter = 'w_or_noop';
    } else {
        debugger;
    }

    const clickJavSetName = (event) => {
        // triggered from toggle group which don't need search string
        console.log('Change jav set to: ', event);
        setLoading(true);
        setJavSet(event);
        setSearchString(''); // clean out search string for future page clicks
        setPageNum('1'); // always get 1st page when switching jav sets
        fetch(`/${source_site}/get_set_javs?set_type=`+String(event)+`&page_num=`+String(1))
            .then(response => response.json())
            .then((jsonData) => {
                //console.log(jsonData.success);
                setJavObjs(jsonData.success.jav_objs);
                setMaxPage(jsonData.success.max_page);
                if (jsonData.errors) {
                    console.log('Error: ', jsonData.error);
                }
                setLoading(false);
            });
    };

    const clickStatFilter = (event) => {
        // triggered from toggle stat filtering group
        console.log('filter on: ', event);
        if (event === 'w_or_noop') {
            setJavStatFilter([0, 2]);
        } else if (event === 'no_filter') {
            setJavStatFilter([]);
        }
    }

    const changeSourceSite = (event) => {
        // triggered from change website source
        console.log('change website source to: ', event);

        // clean current search parameters
        setJavSet(website_set_map[event][0]);
        setSearchString('');
        setPageNum('1');

        setSourceSite(event);
        setToggleList(website_set_map[event]);
    }
  
  
    return(
        <div>
        <ToggleButtonGroup size="sm" type="radio" value={jav_set_name} name="pickJavSet" 
            onChange={clickJavSetName} style={{flexWrap: "wrap"}}>
            {set_toggle_list.map(
                function(sent_value){
                    return (
                        <ToggleButton value={sent_value} key={sent_value}>
                            {isLoading ? <Spinner as="span" animation="grow" size="sm" ole="status" aria-hidden="true" />: t(sent_value)}
                        </ToggleButton>
                    )
                }
            )}
        </ToggleButtonGroup>
        <ToggleButtonGroup size="sm" type="radio" value={current_filter} name="statFilter" 
            onChange={clickStatFilter} style={{flexWrap: "wrap", marginLeft: "5px"}}>
            <ToggleButton value={'no_filter'}>
                {t('no_fitler')}
            </ToggleButton>
            <ToggleButton value={'w_or_noop'}>
                {t('w_or_noop')}
            </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup size="sm" type="radio" value={source_site} name="selectSourceSet" 
            onChange={changeSourceSite} style={{flexWrap: "wrap", marginLeft: "5px", marginTop: "5px"}}>
            <ToggleButton value={'javlib_browser'}>
                {"javlibrary"}
            </ToggleButton>
            <ToggleButton value={'javbus_browser'}>
                {"javbus"}
            </ToggleButton>
        </ToggleButtonGroup>
        </div>
  )};
  
  export default JavSetSearchGroup;