/*
 * DocDoku, Professional Open Source
 * Copyright 2006 - 2015 DocDoku SARL
 *
 * This file is part of DocDokuPLM.
 *
 * DocDokuPLM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DocDokuPLM is distributed in the hope that it will be useful,  
 * but WITHOUT ANY WARRANTY; without even the implied warranty of  
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the  
 * GNU Affero General Public License for more details.  
 *  
 * You should have received a copy of the GNU Affero General Public License  
 * along with DocDokuPLM.  If not, see <http://www.gnu.org/licenses/>.  
 */
package com.docdoku.server.rest.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.List;

/**
 * @author Morgan Guimard
 */
@XmlRootElement
@ApiModel(value="DocumentIterationListDTO", description="This class wraps a list of {@link com.docdoku.core.document.DocumentIteration} entities")
public class DocumentIterationListDTO implements Serializable {

    @ApiModelProperty(value = "List of document iterations")
    private List<DocumentIterationDTO> documents;

    public DocumentIterationListDTO() {
    }

    public List<DocumentIterationDTO> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentIterationDTO> documents) {
        this.documents = documents;
    }
}
