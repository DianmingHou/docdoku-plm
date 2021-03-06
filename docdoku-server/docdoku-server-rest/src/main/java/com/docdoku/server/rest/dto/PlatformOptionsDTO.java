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

import com.docdoku.core.admin.PlatformOptions;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement
@ApiModel(value="PlatformOptionsDTO", description="This class is a representation of a {@link com.docdoku.core.admin.PlatformOptions} entity")
public class PlatformOptionsDTO implements Serializable {

    @ApiModelProperty(value = "Registration strategy")
    private PlatformOptions.OperationSecurityStrategy registrationStrategy;

    @ApiModelProperty(value = "Workspace creation strategy")
    private PlatformOptions.OperationSecurityStrategy workspaceCreationStrategy;

    public PlatformOptionsDTO() {
    }

    public PlatformOptions.OperationSecurityStrategy getRegistrationStrategy() {
        return registrationStrategy;
    }

    public void setRegistrationStrategy(PlatformOptions.OperationSecurityStrategy registrationStrategy) {
        this.registrationStrategy = registrationStrategy;
    }

    public PlatformOptions.OperationSecurityStrategy getWorkspaceCreationStrategy() {
        return workspaceCreationStrategy;
    }

    public void setWorkspaceCreationStrategy(PlatformOptions.OperationSecurityStrategy workspaceCreationStrategy) {
        this.workspaceCreationStrategy = workspaceCreationStrategy;
    }
}
